const express = require("express");
const songController = require("../controllers/song");
const router = express.Router();

router.get("/", songController.getAllSongs);

router.get("/:string", songController.getSong);

router.get("/songtest", songController.songtest);

module.exports = router;
