const express = require("express");
const songController = require("../controllers/song");
const usersController = require("../controllers/users");
const router = express.Router();

const cors = require("cors");
router.use(cors());

router.get("/", usersController.authenticateToken, songController.getAllSongs);

router.get("/:string", songController.getSong);

router.get("/songtest", songController.songTest);

module.exports = router;
