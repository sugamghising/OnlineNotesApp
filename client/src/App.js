import React, { useState, useEffect } from "react";
import "./App.css";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

function App() {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all notes
  const fetchNotes = async () => {
    setLoading(true);
    setError("");
    try {
      const query = filter ? `?tag=${encodeURIComponent(filter)}` : "";
      const res = await fetch(`${API_BASE}/notes${query}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError(`Failed to fetch notes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes on mount and when filter changes
  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Create a new note
  const handleCreateNote = async (noteData) => {
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchNotes();
    } catch (err) {
      setError(`Failed to create note: ${err.message}`);
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchNotes();
    } catch (err) {
      setError(`Failed to delete note: ${err.message}`);
    }
  };

  // Update a note
  const handleUpdateNote = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchNotes();
    } catch (err) {
      setError(`Failed to update note: ${err.message}`);
    }
  };

  // Share a note
  const handleShareNote = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notes/${id}/share`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const shareUrl = `${window.location.origin}/share/${data.shareId}`;
      alert(`Share link:\n\n${shareUrl}`);
    } catch (err) {
      setError(`Failed to share note: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📝 Notes</h1>
      </header>

      <div className="app-content">
        <NoteForm onSubmit={handleCreateNote} />

        {error && <div className="error-banner">{error}</div>}

        <div className="filter-section">
          <label htmlFor="tag-filter">Filter by tag:</label>
          <input
            id="tag-filter"
            type="text"
            placeholder="e.g., work, personal"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
          {filter && (
            <button onClick={() => setFilter("")} className="clear-filter-btn">
              Clear
            </button>
          )}
        </div>

        {loading && <p className="loading">Loading notes...</p>}
        <NoteList
          notes={notes}
          onDelete={handleDeleteNote}
          onUpdate={handleUpdateNote}
          onShare={handleShareNote}
        />
      </div>
    </div>
  );
}

export default App;
