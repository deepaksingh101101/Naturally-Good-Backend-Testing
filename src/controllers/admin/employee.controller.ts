import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import DeliveryGuyModel from '../../models/employee.model';
import jwt from 'jsonwebtoken';
import UserModel from '../../models/user.model';
import EmployeeModel from '../../models/employee.model';

export const createEmployee = async (req: Request, res: Response) => {
    const { Email, Password, FirstName, LastName, PhoneNumber, Dob, Gender, StreetAddress, City, State,roleId } = req.body;
    const loggedInId = req['decodedToken'].id; // Assuming admin ID is stored in the request
        if(!loggedInId){
                return res.status(400).json({ error: 'Superadmin not Found' });
            }
    try {
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
            CreatedBy:loggedInId,
            UpdatedBy:loggedInId,
            Role: roleId, // Replace with actual default role ID or omit if not needed
        });

        await newEmployee.save();

        res.status(201).json({ message: 'Employee created successfully' });
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};



// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// export const deliveryGuyLogin = async (req: Request, res: Response) => {
//     const { Email, Password } = req.body;

//     try {
//         const deliveryGuy = await DeliveryGuyModel.findOne({ Email });

//         if (!deliveryGuy) {
//             return res.status(400).json({ error: 'Invalid email' });
//         }

//         const isPasswordValid = await bcrypt.compare(Password, deliveryGuy.Password);
//         if (!isPasswordValid) {
//             return res.status(400).json({ error: 'Invalid password' });
//         }

//         const token = jwt.sign(
//             { id: deliveryGuy._id, Role: deliveryGuy.Role },
//             JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         res.status(200).json({ message: 'Login successful', token });
//     } catch (error) {
//         console.error('Error logging in:', error);
//         res.status(500).json({ error: 'Internal server error', details: error.message });
//     }
// };



