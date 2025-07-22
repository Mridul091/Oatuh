const pool = require("../config/database");
const crypto = require("crypto");
const fs = require("fs");
const Jwt = require("jsonwebtoken");
const privateKey = fs.readFileSync("./private.pem", "utf8");
// const { generateRandomString } = require("../index.js");
function generateRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}
exports.token = async (req, res) => {
  const { code, redirect_uri, client_id, code_verifier } = req.body;
  console.log("Client id:", client_id);
  console.log("code:", code);
  const userResult = await pool.query(
    "Select * from oauth_clients where client_id = $1",
    [client_id]
  );
  const user = userResult.rows[0];
  console.log("user", user);
  if (!user) {
    return res.status(400).json({ message: "Client not found" });
  }

  const authCodeResult = await pool.query(
    "Select * from authorization_codes where code = $1",
    [code]
  );
  console.log("Auth Code Result:", authCodeResult.rows);
  const authCode = authCodeResult.rows[0];
  console.log("Auth Code:", authCode);

  if (!authCode || new Date() > authCode.expires_at) {
    return res
      .status(400)
      .json({ message: "Invalid or expired authorization code" });
  }

  if (!code_verifier || !authCode.code_challenge) {
    return res.status(400).json({ message: "Invalid code verifier" });
  }

  const recreatedChallenge = crypto
    .createHash("sha256")
    .update(code_verifier)
    .digest("base64url");

  if (recreatedChallenge !== authCode.code_challenge) {
    return res.status(400).json({ message: "Invalid code verifier" });
  }
  await pool.query("DELETE FROM authorization_codes WHERE code = $1", [code]);

  // const accessToken = generateRandomString(32);
  const refreshToken = generateRandomString(32);
  const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now
  // console.log("user id", user.user_id);
  // await pool.query(
  //   "INSERT INTO access_tokens (token, user_id, client_id, expires_at) VALUES ($1, $2, $3, $4)",
  //   [accessToken, authCode.user_id, authCode.client_id, expiresAt]
  // );

  const payload = {
    user_id: authCode.user_id,
    client_id: authCode.client_id,
  };

  const signInOptions = {
    issuer: "my-auth-server",
    audience: user.client_id,
    expiresIn: "1h",
    algorithm: "RS256",
  };

  const accessToken = Jwt.sign(payload, privateKey, signInOptions);

  await pool.query(
    "INSERT INTO refresh_tokens (token, user_id, client_id) VALUES ($1, $2, $3)",
    [refreshToken, authCode.user_id, authCode.client_id]
  );

  res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: 3600,
    token_type: "Bearer",
  });
};
