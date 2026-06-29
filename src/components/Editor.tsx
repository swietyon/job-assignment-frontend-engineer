import { useState } from "react";
import { useParams } from "react-router-dom";
import { findArticle } from "../data/articles";

export default function Editor(): JSX.Element {
  const { slug } = useParams<{ slug?: string }>();
  const article = findArticle(slug);
  const [title, setTitle] = useState(article.title);
  const [description, setDescription] = useState(article.description);
  const [body, setBody] = useState(article.body);
  const [tags, setTags] = useState(article.tags.join(", "));

  return (
    <div>
      <div>
        <h1>
          {slug ? "Edit Article" : "New Article"}
        </h1>
        <p>
          {slug ? "Update your post below." : "Share something worth reading."}
        </p>
      </div>

      <div>
        <div>
          <label>
            Title
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            type="text"
            value={title}
          />
        </div>

        <div>
          <label>
            Description
          </label>
          <input
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this article about?"
            type="text"
            value={description}
          />
        </div>

        <div>
          <label>
            Content
          </label>
          <textarea
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your article…"
            rows={10}
            value={body}
          />
        </div>

        <div>
          <label>
            Tags
          </label>
          <input
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
            type="text"
            value={tags}
          />
          <p>Separate tags with commas.</p>
        </div>

        <div>
          <button type="button">
            Publish Article
          </button>
        </div>
      </div>
    </div>
  );
}