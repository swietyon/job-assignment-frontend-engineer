import React from "react";
import { Link } from "react-router-dom";
import { articles, placeholderAuthorImage } from "../data/articles";

export default function ArticleList(): JSX.Element {
  return (
    <div>
      <header>
        <h1>conduit</h1>
        <p>A place to share knowledge.</p>
      </header>

      <div>
        <section>
          <div>
            <span>
              Global Feed
            </span>
          </div>

          <div>
            {articles.map((article) => (
              <article
                key={article.slug}
              >
                <div>
                  <div>
                    <Link to={`/profile/${article.author.username}`}>
                      <img
                        alt={article.author.name}
                        src={article.author.image || placeholderAuthorImage}
                      />
                    </Link>
                    <div>
                      <Link
                        to={`/profile/${article.author.username}`}
                      >
                        {article.author.name}
                      </Link>
                      <div>{article.publishedAt}</div>
                    </div>
                  </div>

                  <button>
                    <i />
                    {article.favoritesCount}
                  </button>
                </div>

                <Link to={`/${article.slug}`}>
                  <h2>
                    {article.title}
                  </h2>
                  <p>
                    {article.description}
                  </p>
                  <span>
                    Read more →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside>
          <div>
            <h3>
              Popular Tags
            </h3>
            <div>
              {["react", "routing", "conduit", "typescript", "hooks"].map((tag) => (
                <span
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}