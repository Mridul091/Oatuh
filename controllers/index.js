const OauthModels = require("../models/OauthModels.js");
const pool = require("../config/database.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
// const { generateRandomString } = require("../index.js");

function generateRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}
exports.register = async (req, res) => {
  try {
    const { first_name, email, password } = req.body;
    const existingUser = await OauthModels.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Encrypt the password (you can use bcrypt or any other library)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await OauthModels.createUser(
      first_name,
      email,
      hashedPassword
    );
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, redirect_uri, client_id } = req.body;
    console.log("Email:", email);
    const user = await OauthModels.getUserByEmail(email);
    console.log("user", user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const authCode = generateRandomString(16);
    const authCodeExpiresAt = new Date(Date.now() + 300 * 1000); // 5 minutes from now
    console.log("Auth Code:", authCode);
    console.log("Auth Code Expires At:", authCodeExpiresAt);
    console.log("User ID:", user.user_id);
    await pool.query(
      "INSERT INTO authorization_codes (user_id, code, expires_at, client_id, redirect_uri) VALUES ($1, $2, $3, $4, $5)",
      [user.user_id, authCode, authCodeExpiresAt, client_id, redirect_uri]
    );

    const redirectURL = new URL(redirect_uri);
    redirectURL.searchParams.append("code", authCode);
    res.redirect(redirectURL);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
