import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import RoleModel from '../models/role.model';
import PermissionModel from '../models/permission.model';
import { responseHandler } from '../utils/send-response';

const JWT_SECRET = process.env.JWT_SECRET || 'NFC@#$@#@@EDCRWVG#R@R@F$#R#$';

// Higher-order function that takes an action name and returns a middleware
export const checkPermissions = (actionToCheck: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 401,
        message: 'Unauthorized'
      });
    }

    console.log("token recoeved")

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
      const roleId = decoded.role;
      

      // Fetch the role details by ID, including its permissions
      const role = await RoleModel.findById(roleId).populate('permissions.permission');

      if (!role) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 403,
          message: 'Forbidden: Role not found'
        });
      }

      // Check if the role has the required permission by looking for the permission action name
      const hasPermission = role.permissions.some((perm: any) =>
        perm.details.some((detail: any) => {
          return detail.actionName === actionToCheck && detail.isAllowed;
        })
      );

      if (!hasPermission) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 403,
          message: 'You dont have permissions to do this'
        });
      }

      // Store the role and token in the request object for further use
      req['role'] = roleId;
      req['decodedToken'] = decoded;

      next(); // Continue to the next middleware or route handler
    } catch (error: any) {
      console.log(error)
      if (error.name === 'JsonWebTokenError') {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 401,
          message: 'Invalid token'
        });
      }
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: error.message
      });
    }
  };
};
