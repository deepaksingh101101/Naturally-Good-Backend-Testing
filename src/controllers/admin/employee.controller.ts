import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../../models/user.model';
import RoleModel from '../../models/role.model';
import EmployeeModel, { Employee } from '../../models/employee.model';
import jwt from 'jsonwebtoken';
import { DocumentType } from '@typegoose/typegoose';

export const createEmployee = async (req: Request, res: Response) => {
    const { Email, Password, FirstName, LastName, PhoneNumber, Dob, Gender, StreetAddress, City, State, roleId } = req.body;
    const loggedInId = req['decodedToken']?.id;

    if (!loggedInId) {
        return res.status(400).json({ error: 'Invalid Login user' });
    }

    try {
        const role = await RoleModel.findById(roleId);
        if (!role) {
            return res.status(400).json({ error: 'Invalid role ID' });
        }

        const employeeExists = await EmployeeModel.findOne({ Email });
        if (employeeExists) {
            return res.status(400).json({ error: 'Employee already exists' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const newEmployee = new EmployeeModel({
            Email,
            Password: hashedPassword,
            FirstName,
            LastName,
            PhoneNumber,
            Dob,
            Gender,
            StreetAddress,
            City,
            State,
            CreatedBy: loggedInId,
            Role: roleId,
        });

        await newEmployee.save();

        res.status(201).json({ message: 'Employee created successfully' });
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Replace with your actual JWT secret
export const loginEmployee = async (req: Request, res: Response) => {
    const { Email, Password } = req.body;

    try {
        const employee = await EmployeeModel.findOne({ Email }) as DocumentType<Employee>;
        console.log(employee)
        if (!employee) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const isPasswordValid = await employee.validatePassword(Password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: employee._id, email: employee.Email, role: employee.Role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        // Find the role ID for 'Superadmin'
        const superadminRole = await RoleModel.findOne({ roleName: 'Superadmin' }).exec();
        if (!superadminRole) {
            return res.status(400).json({ error: 'Superadmin role not found' });
        }

        const roleIdToExclude = superadminRole._id; // Extract the role ID to exclude

        // Fetch employees excluding the ones with the 'Superadmin' role
        const employees = await EmployeeModel.find({ Role: { $ne: roleIdToExclude } })
            .select('-Password') // Exclude the Password field
            .populate({
                path: 'CreatedBy',
                select: '-Password' // Exclude sensitive fields from CreatedBy
            })
            .exec();

        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const getEmployeeById = async (req: Request, res: Response) => {
    const { id } = req.params; // Get employee ID from the request parameters

    try {
        // Find the employee by ID, excluding the Password field
        const employee = await EmployeeModel.findById(id)
            .select('-Password') // Exclude the Password field
            .populate({
                path: 'CreatedBy',
                select: '-Password' // Exclude sensitive fields from CreatedBy
            })
            .exec();

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error('Error fetching employee by ID:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


