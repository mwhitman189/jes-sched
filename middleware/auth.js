const jwt = require("jsonwebtoken");

const jwt_secret =
  process.env.JWT_SECRET || require("../config/config").JWT_SECRET;

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token) res.status(401).json({ msg: "No token. Authorization denied" });
  console.log("Attempting auth...");

  try {
    console.log("Entered try block...");
    // Verify token
    const decodedToken = jwt.verify(token, jwt_secret);
    // Add user from payload
    req.user = decodedToken;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
    console.log("Entered catch block");
  }
}

module.exports = auth;
