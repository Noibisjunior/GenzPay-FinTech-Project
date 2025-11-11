const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(403).json({ message: 'Token is required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Normalize user object to always include id
    req.user = { id: decoded.userId || decoded.id };
    
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    res.status(401).json({ message: 'Invalid Token' });
  }
}

module.exports = { verifyToken };
