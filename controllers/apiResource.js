const pool = require("../config/database.js");

exports.resource = async (req, res) => {
  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  // const token = authHeader.split(" ")[1];
  // const tokenResult = await pool.query(
  //   "SELECT * FROM access_tokens WHERE token = $1",
  //   [token]
  // );
  // const accessToken = tokenResult.rows[0];
  // console.log("Access Token:", accessToken);
  // if (!accessToken || new Date() > accessToken.expires_at) {
  //   return res.status(401).json({ message: "Invalid access token" });
  // }
  console.log("User ID from token:", req.user);
  const userResult = await pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [req.user.user_id]
  );
  const user = userResult.rows[0];
  console.log("User:", user);
  res.json({
    id: user.id,
    username: user.first_name,
    message: "This is a protected resource!",
    // The decoded claims are available in req.user
    token_claims: req.user,
  });
};
