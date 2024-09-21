import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AdminModel from '../models/oldrole.model';

const JWT_SECRET = process.env.JWT_SECRET || 'NFC@#$@#@@EDCRWVG#R@R@F$#R#$';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role: string };

        const admin = await AdminModel.findById(decoded.id);

    if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        req['adminId'] = admin._id;
        req['decodedToken']=admin;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
