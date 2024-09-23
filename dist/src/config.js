"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.JWT_SECRET = exports.PORT = exports.MONGODB_URI = void 0;
const dotenv_1 = require("dotenv");
const jwt = require('jsonwebtoken');
(0, dotenv_1.config)();
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.PORT = process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SECRET || "NFC@#$@#@@EDCRWVG#R@R@F$#R#$";
/**
 * Generates a JWT token with a given payload.
 *
 * @param {Object} payload - The payload to include in the JWT token.
 * @param {string} [expiresIn='1h'] - Token expiration time.
 * @returns {string} - The generated JWT token.
 */
const generateToken = (payload, expiresIn = '1h') => {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Payload must be a valid object');
    }
    return jwt.sign(payload, exports.JWT_SECRET, { expiresIn });
};
exports.generateToken = generateToken;
