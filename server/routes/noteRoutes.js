import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  shareNote,
  getSharedNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

router.post("/:id/share", shareNote);
router.get("/shared/:shareId", getSharedNote);

export default router;
