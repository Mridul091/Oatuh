const fs = require("fs");
const Jwt = require("jsonwebtoken");
const publicKey = fs.readFileSync("./public.pem", "utf8");

exports.middleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  Jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid access token" });
    }
    req.user = user; // Attach user info to request
    next();
  });
};
