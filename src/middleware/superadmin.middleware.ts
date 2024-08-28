import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const superAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role: string };
        console.log(decoded)
        if (decoded.role !== 'SuperAdmin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        req['decodedToken'] = decoded;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
