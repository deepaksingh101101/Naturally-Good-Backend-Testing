import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import RoleModel from '../models/role.model';
import PermissionModel from '../models/permission.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Higher-order function that takes an action name and returns a middleware
export const checkPermissions = (actionToCheck: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return; // Ensure the function stops executing after responding
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
      const roleId = decoded.role;
console.log(roleId)
      // Fetch the role details by ID, including its permissions
      const role = await RoleModel.findById(roleId).populate('permissions.permission');
console.log(role)
      if (!role) {
        res.status(403).json({ error: 'Forbidden: Role not found' });
        return; // Stop execution after response
      }

      // Fetch the required permission ID from the permission model for the action
      const permission = await PermissionModel.findOne({ 'permissions.name': actionToCheck });

      if (!permission) {
        res.status(403).json({ error: 'Forbidden: Permission not found' });
        return; // Stop execution after response
      }

      // Check if the role has the required permission by looking for the permission ID in the role's details
      const hasPermission = role.permissions.some((perm: any) =>
        perm.permission.equals(permission._id) &&
        perm.details.some((detail: any) => detail.isAllowed)
      );

      if (!hasPermission) {
        res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        return; // Stop execution after response
      }

      // Store the role and token in the request object for further use
      req['role'] = roleId;
      req['decodedToken'] = decoded;

      next(); // Continue to the next middleware or route handler
    } catch (error: any) {
      console.error('Error verifying token:', error);
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ error: 'Invalid token' });
        return; // Stop execution after response
      }
      res.status(500).json({ error: 'Internal server error', details: error.message });
      return; // Stop execution after response
    }
  };
};
