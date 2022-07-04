import express from "express";
import { getUserData, postAlbum, deleteAlbums, deleteAlbum } from "../controllers/usersController.js";

const router = express.Router();

router.get("/:id", getUserData);    // GET /user/1234

router.post("/:id/albums", postAlbum);    // POST /user/1234/albums

router.delete("/:id/albums", deleteAlbums);    // DELETE /user/1234/albums

router.delete("/:id/albums/:albumId", deleteAlbum);  // DELETE /users/1234/albums/5678

export default router;