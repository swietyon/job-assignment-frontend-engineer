import { useAuth } from "context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FollowButton from "components/FollowButton";
import ArticleList from "components/ArticleList"; // <-- Dodany import

type Profile = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

const API_BASE = "http://localhost:3000/api";
const INFO_TIMEOUT_MS = 3000;

export default function Profile(): JSX.Element {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const isOwnProfile = user?.username === username;
  const infoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/profiles/${username}`, {
          signal: controller.signal,
          headers: user ? { Authorization: `Token ${user.token}` } : {},
        });

        const data = await res.json().catch(() => null);

        if (res.ok) {
          setProfile(data.profile);
        } else {
          setError("Failed to load profile.");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      controller.abort();
    };
  }, [user, username]);

  // Cleanup info timeout on unmount
  useEffect(() => {
    return () => {
      if (infoTimeoutRef.current) {
        clearTimeout(infoTimeoutRef.current);
      }
    };
  }, []);

  const updateFollowStatus = async (method: "POST" | "DELETE") => {
    if (!user) return;

    const controller = new AbortController();

    try {
      const res = await fetch(`${API_BASE}/profiles/${username}/follow`, {
        method,
        signal: controller.signal,
        headers: { Authorization: `Token ${user.token}` },
      });

      if (res.ok) {
        setProfile((prev) => (prev ? { ...prev, following: !prev.following } : prev));
      } else {
        setError("Failed to update follow status.");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Network error.");
    }
  };

  const handleFollow = () => updateFollowStatus("POST");
  const handleUnfollow = () => updateFollowStatus("DELETE");

  const handleRestrictedAction = () => {
    if (infoTimeoutRef.current) {
      clearTimeout(infoTimeoutRef.current);
    }

    setShowInfo(true);
    infoTimeoutRef.current = setTimeout(() => setShowInfo(false), INFO_TIMEOUT_MS);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!profile) return <p className="text-center mt-10">Profile not found.</p>;

  return (
    <div className="min-h-auto bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Karta informacyjna profilu */}
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
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Name</p>
              <p className="mt-2 text-slate-600">{profile.username}</p>
            </div>

            {profile.bio && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">About</p>
                <p className="mt-2 text-slate-600">{profile.bio}</p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Following</p>
              <div className="mt-4 flex justify-center">
                <FollowButton
                  following={profile.following}
                  isOwnProfile={isOwnProfile}
                  isLoggedIn={!!user}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                  onRestrictedAction={handleRestrictedAction}
                />
              </div>
              {showInfo && (
                <p className="mt-3 text-center text-sm text-slate-500">
                  {isOwnProfile ? "You cannot follow yourself." : "Log in to follow users."}
                </p>
              )}
            </div>
                    {username && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl ring-1 ring-slate-200 overflow-hidden">
            <ArticleList author={username} />
          </div>
        )}
          </div>

        </div>
      </div>
    </div>
  );
}