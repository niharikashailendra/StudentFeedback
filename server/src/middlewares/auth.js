// src/middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// src/middlewares/auth.js - Enhance the authenticate middleware
exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");

    if (!user) return res.status(403).json({ message: "Forbidden" });

    // Check if user is blocked
    // src/middlewares/auth.js - Update the blocked user response
    if (user.blocked) {
      return res.status(403).json({
        message:
          "Your account has been blocked. Please contact the administrator",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.authorize =
  (roles = []) =>
  (req, res, next) => {
    if (typeof roles === "string") roles = [roles];
    if (!roles.length || roles.includes(req.user.role)) return next();
    return res.status(403).json({ message: "Insufficient privileges" });
  };
