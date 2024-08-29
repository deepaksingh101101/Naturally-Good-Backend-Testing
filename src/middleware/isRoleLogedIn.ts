import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AdminModel from '../models/oldrole.model';
import UserModel from '../models/user.model';
import RoleModel from '../models/role.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const isRoleLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string,role: string };

        const roleId = decoded.role;

        // Fetch the role details by ID, including its permissions
        const role = await RoleModel.findById(roleId).populate('permissions.permission');
  
        if (!role) {
          res.status(403).json({ error: 'Forbidden: Role not found' });
          return; // Stop execution after response
        }
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
