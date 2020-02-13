const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || require("../config/config").JWT_SECRET;

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token) res.status(401).json({ msg: "No token. Authorization denied" });

  try {
    // Verify token
    const decodedToken = jwt.verify(token, JWT_SECRET);
    // Add user from payload
    req.user = decodedToken;
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
  next();
}

module.exports = auth;
