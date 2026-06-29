import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

export default function ArticleList(): JSX.Element {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const placeholderAuthorImage = "";

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);

        const response = await fetch("http://localhost:3000/api/articles");
        const data = await response.json();

        setArticles(data.articles);
      } catch {
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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
     

          <div>
            {articles.map(article => (
              <article key={article.slug} className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${article.author.username}`} className="px-4 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      {article.author.image ? (
                        <img
                          src={article.author.image || `${placeholderAuthorImage}${article.author.username}`}
                          alt={article.author.username}
                          className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                          {article.author.username[0].toUpperCase()}
                        </div>
                      )}
                    </Link>

                    <div>
                      <Link
                        to={`/profile/${article.author.username}`}
                        className="font-semibold text-slate-900 hover:text-blue-600"
                      >
                        {article.author.username}
                      </Link>

                      <div className="text-sm text-slate-500">{new Date(article.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <button className="rounded border border-green-500 px-3 py-1 text-sm text-green-600 hover:bg-green-50">
                    ♥ {article.favoritesCount}
                  </button>
                </div>

                <Link to={`/articles/${article.slug}`}>
                  <h2 className="mb-2 text-2xl font-bold">{article.title}</h2>

                  <p className="mb-4 text-slate-600">{article.description}</p>

                  <span className="text-sm text-blue-600">Read more →</span>
                </Link>
              </article>
            ))}
          </div>
    </div>
  );
}
