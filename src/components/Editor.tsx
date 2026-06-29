import React, { useState } from "react";

export default function Editor(): JSX.Element {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  const publish = () => {
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      article: {
        title,
        description,
        body,
        tagList,
      },
    };

    console.log(JSON.stringify(payload, null, 2));
    
    // Clear fields after publishing
    setTitle("");
    setDescription("");
    setBody("");
    setTags("");
  };

  return (
    <>
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <form>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Article Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What's this article about?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows={8}
                      placeholder="Write your article (in markdown)"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter tags (comma separated)"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                    <div className="tag-list" />
                  </fieldset>
                  <button className="btn btn-lg pull-xs-right btn-primary" type="button" onClick={publish}>
                    Publish Article
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
