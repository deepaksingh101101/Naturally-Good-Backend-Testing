import { Request, Response } from 'express';
import AdminModel, { Admin } from '../../models/role.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../../models/user.model';
import DeliveryGuyModel from '../../models/employee.model';

export const createRole = async (req: Request, res: Response) => {
    const { Email, Password, FirstName, LastName, PhoneNumber, Role } = req.body;
    const SuperAdminId = req['decodedToken'].id;

    const validRoles = ['Admin', 'Subadmin'];
    if (Role && !validRoles.includes(Role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const adminExists = await AdminModel.findOne({ Email });
        if (adminExists) {
            return res.status(400).json({ error: `${adminExists.Role} already exists` });
        }

        const newAdmin = new AdminModel({
            Email,
            Password,
            FirstName,
            LastName,
            PhoneNumber,
            SuperAdminId,
            Role: Role || 'Admin',
            isActive: true
        });

        await newAdmin.save();

        res.status(201).json({ message: `${newAdmin.Role} created successfully` });
    } catch (error) {
        console.error('Error creating Admin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

export const loginRole = async (req: Request, res: Response) => {
    const { Email, Password } = req.body;

    try {
        const admin = await AdminModel.findOne({ Email });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await admin.validatePassword(Password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                Role: admin.Role
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
export const getAllRole = async (req: Request, res: Response) => {
    try {
        const admins = await AdminModel.find().populate('Email');
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching Admins:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

export const getRoleById = async (req: Request, res: Response) => {
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


export const updateRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Password, FirstName, LastName, PhoneNumber, Role, isActive } = req.body;

    const validRoles = ['Admin', 'Subadmin'];
    if (Role && !validRoles.includes(Role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const admin = await AdminModel.findById(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        if (Password) admin.Password = Password;
        if (FirstName) admin.FirstName = FirstName;
        if (LastName) admin.LastName = LastName;
        if (PhoneNumber) admin.PhoneNumber = PhoneNumber;
        if (Role) admin.Role = Role;
        if (typeof isActive === 'boolean') admin.isActive = isActive;

        await admin.save();

        res.status(200).json({ message: `${admin.Role} updated successfully`, admin });
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Filter Admins
export const handleAdminFilter = async (req: Request, res: Response) => {
    try {
        // Extract query parameters from the request
        const {
            Email,
            FirstName,
            LastName,
            PhoneNumber,
            SuperAdminId,
            Role,
            isActive,
            createdAt,
        
        } = req.query;

     
        // Build the query object dynamically
        const query: any = {}; // Use 'any' for a dynamic object

        if (Email) query.Email = Email;
        if (FirstName) query.FirstName = FirstName;
        if (LastName) query.LastName = LastName;
        if (PhoneNumber) query.PhoneNumber = PhoneNumber;
        if (SuperAdminId) query.SuperAdminId = SuperAdminId;
        if (Role) query.Role = Role;
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

// Filter Users
export const handleUserFilter = async (req: Request, res: Response) => {
    try {
        // Extract query parameters from the request
        const {
            userName,
            firstname,
            lastname,
            phoneNo,
            email,
            accountStatus,
            lastLogin,
        } = req.query;

        // Build the query object dynamically
        const query: any = {};

        if (userName) query.userName = userName;
        if (firstname) query.firstname = firstname;
        if (lastname) query.lastname = lastname;
        if (phoneNo) query.phoneNo = phoneNo;
        if (email) query.email = email;
        if (accountStatus) query.accountStatus = accountStatus === 'true'; // Convert string 'true'/'false' to boolean
        if (lastLogin) query.lastLogin = lastLogin;
     

        // Perform the query
        const users = await UserModel.find(query).select('-password');


        // Return the results
        return res.status(200).json(users);

    } catch (error) {
        // Handle any errors that occur
        console.error('Error handling filter:', error);
        return res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};

// Filter Employee
export const handleEmployeeFilter = async (req: Request, res: Response) => {
    try {
        // Extract query parameters from the request
        const {
            Email,
            FirstName,
            LastName,
            PhoneNumber,
            AdminId,
            Role,
            isActive,
            CreatedAt,
            UpdatedAt
        } = req.query;

        // Build the query object dynamically
        const query: any = {};

        if (Email) query.Email = Email;
        if (FirstName) query.FirstName = FirstName;
        if (LastName) query.LastName = LastName;
        if (PhoneNumber) query.PhoneNumber = PhoneNumber;
        if (AdminId) query.AdminId = AdminId;
        if (Role) query.Role = Role;
        if (isActive) query.isActive = isActive === 'true'; // Convert string 'true'/'false' to boolean
        if (CreatedAt) query.CreatedAt = CreatedAt;
        if (UpdatedAt) query.UpdatedAt = UpdatedAt;

        // Perform the query
        const deliveryGuys = await DeliveryGuyModel.find(query).select('-Password');

        // Return the results
        return res.status(200).json(deliveryGuys);

    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
