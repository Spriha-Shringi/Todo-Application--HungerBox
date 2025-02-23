const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log("🔹 Authorization Header:", authHeader); 

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.error(" Invalid token format:", authHeader);
    return res.status(401).json({ message: 'Invalid token format' });
  }

  const token = parts[1];
  console.log(" Extracted Token:", token); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(" Token verification failed:", error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
