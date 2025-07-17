const express = require("express");
const AuthController = require("../controllers/authorize.js");
const LoginController = require("../controllers/index.js");
const TokenController = require("../controllers/token.js");
const router = express.Router();

console.log("Auth routes loaded");

// router.post("/register", AuthController.register);
router.post("/login", LoginController.login);
router.get("/authorize", AuthController.authorize);
router.post("/token", TokenController.token);

module.exports = router;
