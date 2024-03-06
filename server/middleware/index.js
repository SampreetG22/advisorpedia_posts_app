const jwt = require("jsonwebtoken");

// Middleware for authentication
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Middleware for authorization
const authorizeJWT = (req, res, next) => {
  // Check if user is authorized based on userId extracted from JWT
  const userId = req.userId;
  if (userId !== req.params.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

module.exports = {
  authenticateJWT,
  authorizeJWT,
};
