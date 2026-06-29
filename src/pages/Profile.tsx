import { Link, useParams } from "react-router-dom";
import { articles, findAuthor, placeholderAuthorImage } from "../data/articles";

export default function Profile(): JSX.Element {
  const { username } = useParams<{ username: string }>();
  const author = findAuthor(username);
  const authorArticles = articles.filter(
    (article) => article.author.username === author.username
  );

  return (
    <div>
      <div>
        <img
          alt={author.name}
          src={author.image || placeholderAuthorImage}
        />
        <h1>{author.name}</h1>
        {author.bio && (
          <p>
            {author.bio}
          </p>
        )}
        <button>
          <i />
          Follow {author.name} ({author.followersCount})
        </button>
      </div>

      <div>
        <span>
          Articles by {author.name}
        </span>
      </div>

      {authorArticles.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <div>
          {authorArticles.map((article) => (
            <div key={article.slug}>
              <div>
                <div>
                  <Link to={`/profile/${author.username}`}>
                    <img
                      alt={author.name}
                      src={author.image || placeholderAuthorImage}
                    />
                  </Link>
                  <div>
                    <Link to={`/profile/${author.username}`}>
                      {author.name}
                    </Link>
                    <div>{article.publishedAt}</div>
                  </div>
                </div>

                <Link to={`/editor/${article.slug}`}>
                  Edit Article
                </Link>
              </div>

              <Link to={`/${article.slug}`}>
                <h2>
                  {article.title}
                </h2>
                <p>
                  {article.description}
                </p>
                <span>
                  Read more...
                </span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}