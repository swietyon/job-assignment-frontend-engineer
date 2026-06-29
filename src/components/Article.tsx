import { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import ReactMarkdown from "react-markdown";
import FollowButton from "components/FollowButton";
import FavoriteButton from "components/FavoriteButton";

type Article = {
  slug: string;
  title: string;
  body: string;
  createdAt: string;
  favoritesCount: number;
  favorited: boolean;
  author: {
    username: string;
    image: string;
    following: boolean;
  };
};

const API_BASE = "http://localhost:3000/api";
const INFO_TIMEOUT_MS = 3000;

export default function Article(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const history = useHistory();
  const { user } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const infoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOwnProfile = user?.username === article?.author.username;

  useEffect(() => {
    const controller = new AbortController();

    const fetchArticle = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/articles/${slug}`, {
          signal: controller.signal,
          headers: user ? { Authorization: `Token ${user.token}` } : {},
        });

        const data = await res.json();

        if (res.ok) {
          setArticle(data.article);
        } else {
          setError("Failed to load article.");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();

    return () => {
      controller.abort();
    };
  }, [slug, user]);

  useEffect(() => {
    return () => {
      if (infoTimeoutRef.current) {
        clearTimeout(infoTimeoutRef.current);
      }
    };
  }, []);

  const updateFollowStatus = async (method: "POST" | "DELETE") => {
    if (!user || !article) return;

    try {
      const res = await fetch(`${API_BASE}/profiles/${article.author.username}/follow`, {
        method,
        headers: { Authorization: `Token ${user.token}` },
      });

      if (res.ok) {
        setArticle(prev =>
          prev ? { ...prev, author: { ...prev.author, following: method === "POST" } } : prev
        );
      } else {
        setError("Failed to update follow status.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const updateFavoriteStatus = async (favorited: boolean) => {
    if (!user || !article) return;

    const method = favorited ? "DELETE" : "POST";

    try {
      const res = await fetch(`${API_BASE}/articles/${slug}/favorite`, {
        method,
        headers: { Authorization: `Token ${user.token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setArticle(prev =>
          prev
            ? { ...prev, favorited: data.article.favorited, favoritesCount: data.article.favoritesCount }
            : prev
        );
      } else {
        setError("Failed to update favorite.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const handleRestrictedAction = () => {
    if (infoTimeoutRef.current) {
      clearTimeout(infoTimeoutRef.current);
    }

    setShowInfo(true);
    infoTimeoutRef.current = setTimeout(() => setShowInfo(false), INFO_TIMEOUT_MS);
  };

  if (loading) return <div className="text-center mt-10">Loading article...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!article) return <div className="text-center mt-10">Article not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <button
          onClick={() => history.goBack()}
          className="mb-4 rounded border px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
          aria-label="Go back"
        >
          ← Back
        </button>
      </div>

      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">{article.title}</h1>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={article.author.image || `https://ui-avatars.com/api/?name=${article.author.username}`}
                alt={article.author.username}
                className="h-10 w-10 rounded-full"
              />

              <div>
                <p className="font-medium text-slate-900">{article.author.username}</p>
                <p className="text-sm text-slate-500">{new Date(article.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FollowButton
                following={article.author.following}
                isOwnProfile={isOwnProfile}
                isLoggedIn={!!user}
                onFollow={() => updateFollowStatus("POST")}
                onUnfollow={() => updateFollowStatus("DELETE")}
                onRestrictedAction={handleRestrictedAction}
              />

              <FavoriteButton
                favorited={article.favorited}
                favoritesCount={article.favoritesCount}
                isLoggedIn={!!user}
                onFavorite={() => updateFavoriteStatus(false)}
                onUnfavorite={() => updateFavoriteStatus(true)}
              />
            </div>
          </div>

          {showInfo && (
            <p className="mt-3 text-sm text-slate-500">
              {isOwnProfile ? "You cannot follow yourself." : "Log in to follow users."}
            </p>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <div className="prose max-w-none">
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}