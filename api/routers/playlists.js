const express = require("express");
const usersController = require("../controllers/users");
const playlistsController = require("../controllers/playlists");
const router = express.Router();

const cors = require("cors");
router.use(cors());

router.post(
  "/createPlaylist",
  usersController.authenticateToken,
  playlistsController.createPlaylist
);
router.get("/getPlaylist/:playlistID/:userID", playlistsController.getPlaylist);
router.get("/getPlaylists/:userID", playlistsController.getAllPlaylists);
router.get(
  "/getPlaylistsSongs/:playlistID",
  playlistsController.getPlaylistsSongs
);
router.post(
  "/addSong",
  usersController.authenticateToken,
  playlistsController.addSong
);
router.patch(
  "/renamePlaylist",
  usersController.authenticateToken,
  playlistsController.renamePlaylist
);
router.delete(
  "/deletePlaylist/:playlistID",
  usersController.authenticateToken,
  playlistsController.deletePlaylist
);
router.delete(
  "/deleteSong/:songID",
  usersController.authenticateToken,
  playlistsController.deleteSong
);

module.exports = router;
