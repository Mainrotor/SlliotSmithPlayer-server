const express = require("express");
const usersController = require("../controllers/users");
const albumsController = require("../controllers/albums");
const router = express.Router();

const cors = require("cors");
router.use(cors());

router.get("/getAlbum/:albumID", albumsController.getAlbum);

module.exports = router;
