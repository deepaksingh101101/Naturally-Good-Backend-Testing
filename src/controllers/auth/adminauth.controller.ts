import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AdminModel from '../../models/admin.model';

export const signup = async (req: Request, res: Response) => {
    try {
        const { firstname, lastname, phoneNo, email, password, role } = req.body;

        const newAdmin = new AdminModel({
            firstname,
            lastname,
            phoneNo,
            email,
            password,
            role,
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin account created successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const admin = await AdminModel.findOne({ email });

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ email: admin.email, role: admin.role }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};