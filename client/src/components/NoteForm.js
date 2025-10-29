import React, { useState } from "react";

function NoteForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t);

      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags: tagsArray,
      });

      setTitle("");
      setContent("");
      setTags("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h2 style={{ color: "#166534", marginBottom: "0.5rem" }}>Create Note</h2>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input
          id="tags"
          type="text"
          placeholder="e.g., work, personal, urgent"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Creating..." : "✨ Create Note"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setTitle("");
            setContent("");
            setTags("");
          }}
          disabled={submitting}
        >
          Clear
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
