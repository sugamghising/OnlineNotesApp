import React, { useState } from "react";

function NoteList({ notes, onDelete, onUpdate, onShare }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditData({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
    });
  };

  const handleSaveEdit = () => {
    if (!editData.title.trim() || !editData.content.trim()) {
      alert("Title and content cannot be empty");
      return;
    }

    const tagsArray = editData.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t);

    onUpdate(editingId, {
      title: editData.title.trim(),
      content: editData.content.trim(),
      tags: tagsArray,
    });

    setEditingId(null);
    setEditData({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <p>No notes yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div key={note._id} className="note-card">
          {editingId === note._id ? (
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor={`edit-title-${note._id}`}>Title</label>
                <input
                  id={`edit-title-${note._id}`}
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor={`edit-content-${note._id}`}>Content</label>
                <textarea
                  id={`edit-content-${note._id}`}
                  value={editData.content}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor={`edit-tags-${note._id}`}>Tags</label>
                <input
                  id={`edit-tags-${note._id}`}
                  type="text"
                  value={editData.tags}
                  onChange={(e) =>
                    setEditData({ ...editData, tags: e.target.value })
                  }
                />
              </div>

              <div className="edit-form-actions">
                <button
                  className="btn btn-primary btn-small"
                  onClick={handleSaveEdit}
                >
                  ✓ Save
                </button>
                <button
                  className="btn btn-secondary btn-small"
                  onClick={cancelEdit}
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="note-title">{note.title}</h3>
              <p className="note-content">{note.content}</p>

              <div className="note-meta">
                <div className="note-date">📅 {formatDate(note.createdAt)}</div>
                {note.shareId && (
                  <div className="note-date" style={{ color: "#059669" }}>
                    🔗 Shared
                  </div>
                )}
              </div>

              {note.tags && note.tags.length > 0 && (
                <div className="note-tags">
                  {note.tags.map((tag) => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="note-actions">
                <button
                  className="btn btn-primary btn-small"
                  onClick={() => startEdit(note)}
                >
                  ✎ Edit
                </button>
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => onShare(note._id)}
                >
                  🔗 Share
                </button>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => onDelete(note._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default NoteList;
