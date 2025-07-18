const pool = require("../config/database.js");

exports.resource = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const tokenResult = await pool.query(
    "SELECT * FROM access_tokens WHERE token = $1",
    [token]
  );
  const accessToken = tokenResult.rows[0];
  console.log("Access Token:", accessToken);
  if (!accessToken || new Date() > accessToken.expires_at) {
    return res.status(401).json({ message: "Invalid access token" });
  }
  const userResult = await pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [accessToken.user_id]
  );
  const user = userResult.rows[0];
  console.log("User:", user);
  res.json({
    user_id: user.user_id,
    first_name: user.first_name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
    message: "Resource accessed successfully",
  });
};
