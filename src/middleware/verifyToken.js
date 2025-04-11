// middlewares/verifyToken.js
import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const tokenOnly = token.replace('Bearer ', ''); // en caso de "Bearer <token>"

  try {
    const decoded = jwt.verify(tokenOnly, process.env.JWT_SECRET);
    req.user = decoded; // puedes acceder al usuario desde req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}
