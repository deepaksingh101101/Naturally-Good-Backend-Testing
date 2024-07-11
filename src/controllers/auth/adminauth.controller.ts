import { Request, Response } from 'express';
import { DocumentType } from '@typegoose/typegoose';
import AdminModel, { Admin } from '../../models/admin.model';
import SuperAdminModel from '../../models/superadmin.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createAdmin = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    const superAdminId = req['decodedToken'].id;

    try {
        const adminExists = await AdminModel.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new AdminModel({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            superAdminId,
            role: 'admin',
            updatedAt: new Date(),
            createdAt: new Date(),
        });

        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Error creating Admin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await AdminModel.find().populate('email');
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching Admins:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

export const getAdminById = async (req: Request, res: Response) => {
    const adminId = req.params.adminId;

    try {
        const admin = await AdminModel.findById(adminId).populate('_id');

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json(admin);
    } catch (error) {
        console.error('Error fetching Admin by ID:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const updateAdmin = async (req: Request, res: Response) => {
    try {
        const adminId = req.params.adminId;
        const updateOps = {};

        const allowedFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'password'];
        for (const key of allowedFields) {
            if (req.body[key]) {
                updateOps[key] = req.body[key];
            }
        }

        const updatedAdmin = await AdminModel.findByIdAndUpdate(adminId, { $set: updateOps }, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json(updatedAdmin);
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const adminLogin = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const admin = await AdminModel.findOne({ email });
        console.log("Admin:", admin);
        console.log("Email:", email);

        if (!admin) {
            console.error(`Admin with email ${email} not found.`);
            return res.status(401).json({ error: 'Email not found' });
        }

        const passwordMatch = await AdminModel.findOne({ email, password: admin.password });
        console.log("Password Match:", passwordMatch);

        if (!passwordMatch) {
            console.error(`Password for email ${email} is incorrect.`);
            return res.status(401).json({ error: 'Password incorrect' });
        }
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ message: 'Login successful' ,token});
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
