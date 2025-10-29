import Note from "../models/Note.js";
import { randomBytes } from "crypto";

//create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required." });
    }
    const note = new Note({
      title,
      content,
      tags: tags || [],
    });
    await note.save();
    res.status(201).json({ message: "Note created successfully.", note });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//get all notes
const getNotes = async (req, res) => {
  try {
    const { tag } = req.query;
    let query = {};

    if (tag) {
      query.tags = { $in: [tag] };
    }
    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get a single note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, tags },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Share a note
const shareNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // If already shared, return existing shareId
    if (note.shareId) {
      return res.json({ shareId: note.shareId });
    }

    // Generate a unique share ID
    let shareId;
    let isUnique = false;

    while (!isUnique) {
      shareId = generateShareId();
      const existingNote = await Note.findOne({ shareId });
      if (!existingNote) {
        isUnique = true;
      }
    }

    note.shareId = shareId;
    await note.save();

    res.json({ shareId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get shared note by shareId
const getSharedNote = async (req, res) => {
  try {
    const note = await Note.findOne({ shareId: req.params.shareId });
    if (!note) {
      return res.status(404).json({ message: "Shared note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to generate a short unique share ID
function generateShareId() {
  // Use 6 random bytes encoded as URL-safe base64 (8 chars) for a short, crypto-safe ID
  return randomBytes(6).toString("base64url");
}

export {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  shareNote,
  getSharedNote,
};
