import { Request, Response } from 'express';
import SuperAdminModel, { SuperAdmin } from '../../models/superadmin.model';
import { DocumentType } from '@typegoose/typegoose';
import jwt from 'jsonwebtoken';
import AdminModel from '../../models/admin.model';




export const createSuperAdmin = async (req: Request, res: Response) => {
    try {
        const existingSuperAdmin = await SuperAdminModel.findOne({});
        if (existingSuperAdmin) {
            return res.status(400).json({ error: 'SuperAdmin already exists' });
        }
        const superAdmin = new SuperAdminModel(req.body);
        await superAdmin.save();
        res.status(201).json({ message: 'SuperAdmin created successfully' });
    } catch (error) {
        console.error('Error creating SuperAdmin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};





const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const loginSuperAdmin = async (req: Request, res: Response) => {
    const { Email, Password } = req.body;

    try {
        const superAdmin = await SuperAdminModel.findOne({ Email }) as DocumentType<SuperAdmin>;
        if (!superAdmin) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const isPasswordValid = await superAdmin.validatePassword(Password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: superAdmin._id, email: superAdmin.Email, role: superAdmin.Role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};






export const handleFilter = async (req: Request, res: Response) => {
    try {
        // Extract query parameters from the request
        const {
            email,
            firstName,
            lastName,
            phoneNumber,
            superAdminId,
            role,
            isActive,
            createdAt,
            address,
            accountStatus,
            subscriptionPlan,
            lastLogin
        } = req.query;

        // Check if at least one query parameter is provided
        if (!address || !accountStatus || !subscriptionPlan || !lastLogin || !email && !firstName && !lastName && !phoneNumber && !superAdminId && !role && !isActive && !createdAt) {
            return res.status(400).json({ error: 'At least one query parameter is required' });
        }

        // Build the query object dynamically
        const query: any = {}; // Use 'any' for a dynamic object

        if (email) query.Email = email;
        if (firstName) query.FirstName = firstName;
        if (lastName) query.LastName = lastName;
        if (phoneNumber) query.PhoneNumber = phoneNumber;
        if (superAdminId) query.SuperAdminId = superAdminId;
        if (role) query.Role = role;
        if (isActive) query.isActive = isActive === 'true'; // Convert string 'true'/'false' to boolean
        if (createdAt) query.createdAt = createdAt; 

        // Perform the query
        const admins = await AdminModel.find(query).select('-Password');

        // Return the results
        return res.status(200).json(admins);

    } catch (error) {
        // Handle any errors that occur
        console.error('Error handling filter:', error);
        return res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};
