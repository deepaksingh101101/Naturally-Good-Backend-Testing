"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoleLoggedIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const role_model_1 = __importDefault(require("../models/role.model"));
const send_response_1 = require("../utils/send-response");
const JWT_SECRET = process.env.JWT_SECRET || 'NFC@#$@#@@EDCRWVG#R@R@F$#R#$';
const isRoleLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: 'Unauthorized'
        });
    }
    const token = authHeader.split(' ')[1];
    console.log(token);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const roleId = decoded.role;
        req['decodedToken'] = decoded.id;
        console.log(decoded);
        // Fetch the role details by ID, including its permissions
        const role = yield role_model_1.default.findById(roleId).populate('permissions.permission');
        if (!role) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 403,
                message: 'Forbidden: Role not found'
            });
        }
        next();
    }
    catch (error) {
        console.error('Error verifying token:', error);
        if (error.name === 'JsonWebTokenError') {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 401,
                message: 'Invalid token'
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.isRoleLoggedIn = isRoleLoggedIn;
