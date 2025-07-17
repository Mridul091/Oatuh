const pool = require("../config/database.js");
exports.getUserByEmail = async (email) => {
  const result = await pool.query("Select * from users where email = $1", [
    email,
  ]);
  return result.rows[0];
};

exports.createUser = async (first_name, email, password) => {
  const result = await pool.query(
    "Insert into users (first_name,email,password_hash) values ($1, $2, $3) RETURNING *",
    [first_name, email, password]
  );
  return result.rows[0];
};
