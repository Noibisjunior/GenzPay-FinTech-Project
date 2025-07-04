const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: 'Token is required' });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid Token' });
  }
}

module.exports = { verifyToken };
