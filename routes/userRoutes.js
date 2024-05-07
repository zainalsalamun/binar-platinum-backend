const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");


router.get("/", userController.getUser)

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/:id", userController.getUserById);

module.exports = router;