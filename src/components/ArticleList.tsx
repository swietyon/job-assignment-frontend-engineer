import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import FollowButton from "components/FollowButton";
import FavoriteButton from "components/FavoriteButton";

type Author = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  favoritesCount: number;
  favorited: boolean;
  tagList: string[];
  author: Author;
};

const API_BASE = "http://localhost:3000/api";
const INFO_TIMEOUT_MS = 3000;

export default function ArticleList(): JSX.Element {
  const { user } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoUsername, setInfoUsername] = useState<string | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  const infoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const placeholderAuthorImage = "";

  useEffect(() => {
    const controller = new AbortController();

    const fetchArticles = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE}/articles`, {
          signal: controller.signal,
          headers: user ? { Authorization: `Token ${user.token}` } : {},
        });
        const data = await response.json();

        setArticles(data.articles);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();

    return () => {
      controller.abort();
    };
  }, [user]);

  useEffect(() => {
    return () => {
      if (infoTimeoutRef.current) {
        clearTimeout(infoTimeoutRef.current);
      }
    };
  }, []);

  const updateFollowStatus = async (username: string, method: "POST" | "DELETE") => {
    if (!user) return;

    try {
      const res = await fetch(`${API_BASE}/profiles/${username}/follow`, {
        method,
        headers: { Authorization: `Token ${user.token}` },
      });

      if (res.ok) {
        setArticles(prev =>
          prev.map(article =>
            article.author.username === username
              ? { ...article, author: { ...article.author, following: method === "POST" } }
              : article
          )
        );
      } else {
        setError("Failed to update follow status.");
      }
    } catch {
      setError("Network error.");
    }
  };

  const updateFavoriteStatus = async (slug: string, favorited: boolean) => {
    if (!user) return;

    const method = favorited ? "DELETE" : "POST";

    try {
      const res = await fetch(`${API_BASE}/articles/${slug}/favorite`, {
        method,
        headers: { Authorization: `Token ${user.token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setArticles(prev =>
          prev.map(article =>
            article.slug === slug
              ? { ...article, favorited: data.article.favorited, favoritesCount: data.article.favoritesCount }
              : article
          )
        );
      } else {
        setFavoriteError("Failed to update favorite.");
      }
    } catch {
      setFavoriteError("Network error.");
    }
  };

  const handleRestrictedAction = (username: string) => {
    if (infoTimeoutRef.current) {
      clearTimeout(infoTimeoutRef.current);
    }

    setInfoUsername(username);
    infoTimeoutRef.current = setTimeout(() => setInfoUsername(null), INFO_TIMEOUT_MS);
  };

  if (loading) {
    return <div className="py-10 text-center">Loading articles...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <h2 className="mb-4 text-2xl font-bold">Articles</h2>
      </div>

      {favoriteError && (
        <p className="mb-4 text-center text-sm text-red-500">{favoriteError}</p>
      )}

      <div>
        {articles.map(article => {
          const { author } = article;
          const isOwnProfile = user?.username === author.username;

          return (
            <article key={article.slug} className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/profile/${author.username}`}
                    className="px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {author.image ? (
                      <img
                        src={author.image || `${placeholderAuthorImage}${author.username}`}
                        alt={author.username}
                        className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                        {author.username[0].toUpperCase()}
                      </div>
                    )}
                  </Link>

                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/profile/${author.username}`}
                        className="font-semibold text-slate-900 hover:text-blue-600"
                      >
                        {author.username}
                      </Link>

                      <FollowButton
                        following={author.following}
                        isOwnProfile={isOwnProfile}
                        isLoggedIn={!!user}
                        onFollow={() => updateFollowStatus(author.username, "POST")}
                        onUnfollow={() => updateFollowStatus(author.username, "DELETE")}
                        onRestrictedAction={() => handleRestrictedAction(author.username)}
                        compact
                      />
                    </div>

                    {infoUsername === author.username && (
                      <p className="mt-1 text-xs text-slate-500">
                        {isOwnProfile ? "You cannot follow yourself." : "Log in to follow users."}
                      </p>
                    )}

                    <div className="text-sm text-slate-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <FavoriteButton
                  favorited={article.favorited}
                  favoritesCount={article.favoritesCount}
                  isLoggedIn={!!user}
                  onFavorite={() => updateFavoriteStatus(article.slug, false)}
                  onUnfavorite={() => updateFavoriteStatus(article.slug, true)}
                />
              </div>

              <Link to={`/articles/${article.slug}`}>
                <h2 className="mb-2 text-2xl font-bold">{article.title}</h2>
                <p className="mb-4 text-slate-600">{article.description}</p>
                <span className="text-sm text-blue-600">Read more →</span>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
