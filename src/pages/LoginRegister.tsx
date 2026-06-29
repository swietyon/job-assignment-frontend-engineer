import { useAuth } from "context/AuthContext";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

type ServerErrors = {
  errors?: Record<string, string[]>;
};

export default function LoginRegister(): JSX.Element {
  const { login } = useAuth();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [serverErrors, setServerErrors] = useState<ServerErrors | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successToken, setSuccessToken] = useState<string | null>(null);

  const validate = (): string[] => {
    const e: string[] = [];
    if (!email) e.push("Email is required");
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) e.push("Invalid email format");
    if (!password) e.push("Password is required");
    else if (password.length < 6) e.push("Password must be at least 6 characters long");
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerErrors(null);
    const v = validate();
    setErrors(v);
    if (v.length) return;

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email, password } }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        login(data.user);
        setSuccessToken(data.user.token);
        setTimeout(() => history.push("/"), 2000);
      } else if (res.status === 401 || res.status === 422) {
        if (data?.errors) {
          setServerErrors(data);
        } else {
          setServerErrors({ errors: { body: ["Invalid email or password"] } });
        }
      } else {
        setServerErrors({ errors: { body: ["Invalid email or password"] } });
      }
    } catch (err) {
      setServerErrors({ errors: { body: ["Network error"] } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-60 h-80 flex items-center justify-center bg-gray-80 px-4">
      <div className="w-full max-w-md bg-white p-2 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center">Log in</h1>

        {successToken && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded">
            <p className="font-medium">Logged in successfully!</p>
            <p className="text-xs mt-1 text-green-600">Redirecting in a moment...</p>
          </div>
        )}

        {serverErrors?.errors && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            <ul className="list-disc ml-5">
              {Object.entries(serverErrors.errors).flatMap(([key, vals]) =>
                vals.map((v, i) => <li key={`${key}-${i}`}>{v}</li>)
              )}
            </ul>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
            <ul className="list-disc ml-5">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <label className="block mb-3">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
              autoComplete="off"
              required
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your password"
              autoComplete="new-password"
              required
            />
          </label>
          <button
            type="submit"
            disabled={submitting || !!successToken}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
