import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Profile = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

export default function Profile(): JSX.Element {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/profiles/${username}`, {
          headers: user ? { Authorization: `Token ${user.token}` } : {},
        });
        const data = await res.json().catch(() => null);
        if (res.ok) {
          setProfile(data.profile);
          // initialize followers count if provided by API
          setFollowersCount(typeof data.profile.followersCount === "number" ? data.profile.followersCount : 0);
        } else {
          setError("Failed to load profile.");
        }
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, username]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!profile) return <p className="text-center mt-10">Profile not found.</p>;

  return (
    <div className="min-h-auto bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
          <div className="bg-slate-900 px-8 py-10 text-center">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.username}
                className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-sm"
              />
            ) : (
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-200 text-5xl font-bold text-blue-700 ring-4 ring-white shadow-sm">
                {profile.username[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-6 px-8 py-8 sm:px-10">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="mt-2 text-md font-semibold text-slate-900">Name</p>
              <p className="mt-2 text-slate-600">{profile.username}</p>
            </div>

            {profile.bio && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">About</p>
                <p className="mt-2 text-slate-600">{profile.bio || "User has not added a bio yet."}</p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Following</p>
                <div className="mt-2 flex items-center gap-4">
                  <p className="text-md font-semibold text-slate-900">{followersCount}</p>
                  <button
                    onClick={async () => {
                      if (!user) return setError("You must be logged in to follow users.");
                      const method = profile.following ? "DELETE" : "POST";
                      try {
                        const res = await fetch(`http://localhost:3000/api/profiles/${username}/follow`, {
                          method,
                          headers: { Authorization: `Token ${user.token}` },
                        });
                        if (res.ok) {
                          // toggle following and update count
                          setProfile(p => (p ? { ...p, following: !p.following } : p));
                          setFollowersCount(c => (profile.following ? c - 1 : c + 1));
                        } else {
                          setError("Failed to update follow status.");
                        }
                      } catch {
                        setError("Network error.");
                      }
                    }}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    {profile.following ? "Unfollow" : "Follow"}
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
