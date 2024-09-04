import { config } from "dotenv";
const jwt = require('jsonwebtoken');

config();

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1/naturally-goods";
export const PORT = process.env.PORT || 3001;

export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

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