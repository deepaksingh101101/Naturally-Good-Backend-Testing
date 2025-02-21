import { config } from "dotenv";
const jwt = require('jsonwebtoken');

config();

export const MONGODB_URI =
  process.env.MONGODB_URI 
export const PORT = process.env.PORT;

export const JWT_SECRET = process.env.JWT_SECRET || "NFC@#$@#@@EDCRWVG#R@R@F$#R#$";

/**
 * Generates a JWT token with a given payload.
 * 
 * @param {Object} payload - The payload to include in the JWT token.
 * @param {string} [expiresIn='1h'] - Token expiration time.
 * @returns {string} - The generated JWT token.
 */
export const generateToken = (payload: any, expiresIn = '1h') => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a valid object');
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};