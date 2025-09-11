import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const Jwt_secret = process.env.JWTKEY;

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token is provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, Jwt_secret);

    
    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { userId: decoded.userId }; 
    next();
  } catch (e) {
    console.error('JWT Error:', e.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authentication;
