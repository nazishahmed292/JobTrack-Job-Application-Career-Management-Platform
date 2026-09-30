import jwt from 'jsonwebtoken';

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || 'jobtrack-secret', {
    expiresIn: '7d',
  });

export default generateToken;
