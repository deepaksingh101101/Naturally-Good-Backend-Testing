import { Request, Response } from 'express';
import { DocumentType } from '@typegoose/typegoose';
import AdminModel, { Admin } from '../../models/admin.model';

export const createAdmin = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    const superAdminId = req['decodedToken'].id;

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
            superAdminId,
            role: 'admin',
            updatedAt: new Date(),
            createdAt: new Date(),
        });

        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', });
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
        const admin = await AdminModel.findById(adminId).populate( '_id');

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json(admin);
    } catch (error) {
        console.error('Error fetching Admin by ID:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};