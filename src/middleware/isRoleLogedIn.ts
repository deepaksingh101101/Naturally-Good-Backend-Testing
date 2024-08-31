import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AdminModel from '../models/oldrole.model';
import UserModel from '../models/user.model';
import RoleModel from '../models/role.model';
import { responseHandler } from '../utils/send-response';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const isRoleLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: 'Unauthorized'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role: string };

        const roleId = decoded.role;
        req['decodedToken'] = decoded.id;

        // Fetch the role details by ID, including its permissions
        const role = await RoleModel.findById(roleId).populate('permissions.permission');

        if (!role) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 403,
                message: 'Forbidden: Role not found'
            });
        }

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        if (error.name === 'JsonWebTokenError') {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 401,
                message: 'Invalid token'
            });
        }
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'+ error.message,
        });
    }
};
