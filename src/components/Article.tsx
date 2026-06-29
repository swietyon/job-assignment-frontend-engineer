import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import ReactMarkdown from "react-markdown";

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

export default function Article(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const history = useHistory();
  const { user } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);

        const res = await fetch(`http://localhost:3000/api/articles/${slug}`, {
          headers: user ? { Authorization: `Token ${user.token}` } : {},
        });

        const data = await res.json();

        if (res.ok) {
          setArticle(data.article);
        } else {
          setError("Failed to load article.");
        }
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, user]);

  if (loading) return <div className="text-center mt-10">Loading article...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!article) return <div className="text-center mt-10">Article not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      {/* Back button top-left */}
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
        {/* Header */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">{article.title}</h1>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={article.author.image || "https://ui-avatars.com/api/?name=" + article.author.username}
                className="h-10 w-10 rounded-full"
              />

              <div>
                <p className="font-medium text-slate-900">{article.author.username}</p>
                <p className="text-sm text-slate-500">{new Date(article.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Follow button */}
            <button className="rounded border px-3 py-1 text-sm text-slate-700 hover:bg-slate-100">
              Follow ({article.author.following ? "Following" : "Not following"})
            </button>
          </div>

          {/* Favorites */}
          <div className="mt-4">
            <button className="rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700">
              ♥ Favorite ({article.favoritesCount})
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <div className="prose max-w-none">
            <ReactMarkdown>{article.body}</ReactMarkdown>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
