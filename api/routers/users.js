const express = require("express");
const usersController = require("../controllers/users");
const router = express.Router();

const cors = require("cors");
router.use(cors());

router.get("/checkEmail/:string", usersController.checkEmail);
router.post("/signUp", usersController.createAccount);
router.post("/login", usersController.login);

module.exports = router;
