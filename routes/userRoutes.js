const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

// Route for get user
router.get("/users", userController.getUser)

// Route for user registration
router.post("/register", userController.registerUser);

// Route for user login
router.post("/login", userController.loginUser);

module.exports = router;