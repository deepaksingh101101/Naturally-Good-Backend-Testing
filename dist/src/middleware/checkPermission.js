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
exports.checkPermissions = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const role_model_1 = __importDefault(require("../models/role.model"));
const send_response_1 = require("../utils/send-response");
const JWT_SECRET = process.env.JWT_SECRET || 'NFC@#$@#@@EDCRWVG#R@R@F$#R#$';
// Higher-order function that takes an action name and returns a middleware
const checkPermissions = (actionToCheck) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 401,
                message: 'Unauthorized'
            });
        }
        console.log("token recoeved");
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const roleId = decoded.role;
            // Fetch the role details by ID, including its permissions
            const role = yield role_model_1.default.findById(roleId).populate('permissions.permission');
            if (!role) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 403,
                    message: 'Forbidden: Role not found'
                });
            }
            // Check if the role has the required permission by looking for the permission action name
            const hasPermission = role.permissions.some((perm) => perm.details.some((detail) => {
                return detail.actionName === actionToCheck && detail.isAllowed;
            }));
            if (!hasPermission) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 403,
                    message: 'You dont have permissions to do this'
                });
            }
            // Store the role and token in the request object for further use
            req['role'] = roleId;
            req['decodedToken'] = decoded;
            next(); // Continue to the next middleware or route handler
        }
        catch (error) {
            console.log(error);
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
};
exports.checkPermissions = checkPermissions;
