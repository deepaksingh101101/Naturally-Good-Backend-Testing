// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import { DocumentType } from '@typegoose/typegoose';
// import AdminModel, { Admin } from '../../models/admin.model';

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// export const createAdmin = async (req: Request, res: Response) => {
//     const { email, password } = req.body;

//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role: string };
//         if (decoded.role !== 'superadmin') {
//             return res.status(403).json({ error: 'Forbidden' });
//         }

//         const admin = await AdminModel.findOne({ email }) as DocumentType<Admin>;
//         if (admin) {
//             return res.status(400).json({ error: 'Admin already exists' });
//         }

//         const newAdmin = new AdminModel({ email, password });
//         await newAdmin.save();

//         res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
//     } catch (error) {
//         console.error('Error creating Admin:', error);
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ error: 'Invalid token' });
//         }
//         res.status(500).json({ error: 'Internal server error', details: error.message });
//     }
// };
import { Request, Response } from 'express';
import { DocumentType } from '@typegoose/typegoose';
import AdminModel, { Admin } from '../../models/admin.model';

export const createAdmin = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    const superAdminId = req['decodedToken'].id; // Assuming you store superAdminId in decoded token

    try {
        const admin = await AdminModel.findOne({ email }) as DocumentType<Admin>;
        if (admin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        const newAdmin = new AdminModel({
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            superAdminId, // Assign superAdminId to the new Admin
            role: 'admin', // Assuming newly created admins default to 'admin' role
            updatedAt: new Date(),
            createdAt: new Date(),
        });

        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        console.error('Error creating Admin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
