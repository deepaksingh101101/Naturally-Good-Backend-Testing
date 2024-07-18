import { Request, Response } from 'express';
import AdminModel, { Admin } from '../../models/admin.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createAdmin = async (req: Request, res: Response) => {
    const { Email, Password, FirstName, LastName, PhoneNumber } = req.body;
    const SuperAdminId = req['decodedToken'].id;

    try {
        const adminExists = await AdminModel.findOne({ Email });
        if (adminExists) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const newAdmin = new AdminModel({
            Email,
            Password: hashedPassword,
            FirstName,
            LastName,
            PhoneNumber,
            SuperAdminId,
            Role: 'admin',
            UpdatedAt: new Date(),
            CreatedAt: new Date(),
        });

        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Error creating Admin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
export const adminLogin = async (req: Request, res: Response) => {
    const { Email, Password } = req.body;

    try {
        const admin = await AdminModel.findOne({ Email });
        console.log("Admin", admin)
        if (!admin) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const isPasswordValid = await bcrypt.compare(Password, admin.Password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.Role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
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
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, password, isActive } = req.body;

    try {
        const admin = await AdminModel.findById(id);
        console.log("Admin",admin)
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        if (firstName !== undefined) admin.FirstName = firstName;
        if (lastName !== undefined) admin.LastName = lastName;
        if (phoneNumber !== undefined) admin.PhoneNumber = phoneNumber;
        if (isActive !== undefined) admin.isActive = isActive;
        if (password !== undefined) {
            admin.Password = await bcrypt.hash(password, 10);
        }

        admin.updatedAt = new Date();

        await admin.save();

        res.status(200).json({ message: 'Admin updated successfully' });
    } catch (error) {
        console.error('Error updating Admin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
