import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import DeliveryGuyModel from '../../models/employee.model';
import jwt from 'jsonwebtoken';
import UserModel from '../../models/user.model';

export const createDeliveryGuy = async (req: Request, res: Response) => {
    const { Email, Password, FirstName, LastName, PhoneNumber } = req.body;
    const AdminId = req['adminId'];

    try {
        const deliveryGuyExists = await DeliveryGuyModel.findOne({ Email });
        if (deliveryGuyExists) {
            return res.status(400).json({ error: 'Delivery guy already exists' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const newDeliveryGuy = new DeliveryGuyModel({
            Email,
            Password: hashedPassword,
            FirstName,
            LastName,
            PhoneNumber,
            AdminId,
            Role: 'delivery_guy',
            UpdatedAt: new Date(),
            CreatedAt: new Date(),
        });

        await newDeliveryGuy.save();

        res.status(201).json({ message: 'Delivery guy created successfully' });
    } catch (error) {
        console.error('Error creating delivery guy:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};



const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const deliveryGuyLogin = async (req: Request, res: Response) => {
    const { Email, Password } = req.body;

    try {
        const deliveryGuy = await DeliveryGuyModel.findOne({ Email });

        if (!deliveryGuy) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const isPasswordValid = await bcrypt.compare(Password, deliveryGuy.Password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: deliveryGuy._id, Role: deliveryGuy.Role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};



export const updateDeliveryGuy = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Email, Password, FirstName, LastName, PhoneNumber, isActive } = req.body;

    if (Email) {
        return res.status(400).json({ error: 'Email cannot be changed' });
    }

    try {
        const deliveryGuy = await DeliveryGuyModel.findById(id);
        if (!deliveryGuy) {
            return res.status(404).json({ error: 'Delivery guy not found' });
        }

        if (Password) {
            const hashedPassword = await bcrypt.hash(Password, 10);
            deliveryGuy.Password = hashedPassword;
        }

        if (FirstName) deliveryGuy.FirstName = FirstName;
        if (LastName) deliveryGuy.LastName = LastName;
        if (PhoneNumber) deliveryGuy.PhoneNumber = PhoneNumber;
        if (typeof isActive !== 'undefined') deliveryGuy.isActive = isActive;

        deliveryGuy.UpdatedAt = new Date();

        await deliveryGuy.save();

        res.status(200).json({ message: 'Delivery guy updated successfully' });
    } catch (error) {
        console.error('Error updating delivery guy:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const getAllDeliveryGuys = async (req: Request, res: Response) => {
    try {
        const deliveryGuys = await DeliveryGuyModel.find();
        res.status(200).json(deliveryGuys);
    } catch (error) {
        console.error('Error fetching delivery guys:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const getDeliveryGuyById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deliveryGuy = await DeliveryGuyModel.findById(id);
        if (!deliveryGuy) {
            return res.status(404).json({ error: 'Delivery guy not found' });
        }
        res.status(200).json(deliveryGuy);
    } catch (error) {
        console.error('Error fetching delivery guy:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Update Status of employee active ot inactive
export const updateEmployeeStatus = async (req: Request, res: Response) => {
    const { id } = req.query;
    const { isActive } = req.body;

    try {
        const deliveryGuy = await DeliveryGuyModel.findById(id);

        if (!deliveryGuy) {
            return res.status(404).json({ error: 'Delivery guy not found' });
        }

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ error: 'Invalid status. "isActive" must be a boolean value.' });
        }

        deliveryGuy.isActive = isActive;
        deliveryGuy.UpdatedAt = new Date();

        await deliveryGuy.save();

        res.status(200).json({ message: `Employee marked as ${isActive ? 'active' : 'inactive'}`, deliveryGuy });
    } catch (error) {
        console.error('Error updating delivery guy:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


// Update Status for Active and Inactive
export const updateUserStatus = async (req: Request, res: Response) => {
    const { id } = req.query;
    const { accountStatus } = req.body;
  
    try {
      // Find the user by ID
      const user = await UserModel.findById(id);
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Validate that accountStatus is a boolean
      if (typeof accountStatus !== 'boolean') {
        return res.status(400).json({ error: 'Invalid status. "accountStatus" must be a boolean value.' });
      }
  
      // Update the accountStatus and lastLogin fields
      user.accountStatus = accountStatus;
      user.lastLogin = new Date().toISOString();
  
      // Save the updated user
      await user.save();
  
      // Respond with success message and updated user
      res.status(200).json({ message: `User marked as ${accountStatus ? 'active' : 'inactive'}`, user });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };


  // Update Status for Active and Inactive
  export const assignEmployee = async (req: Request, res: Response) => {
    const { userId, employeeId } = req.query;
  
    try {
      // Validate input
      if (typeof userId !== 'string' || typeof employeeId !== 'string') {
        return res.status(400).json({ error: 'Both userId and employeeId are required and must be strings.' });
      }
  
      // Find the user by userId
      const user = await UserModel.findById(userId);
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Assign employeeId to the user
      user.assignedEmployee = employeeId;
  
      // Save the updated user
      await user.save();
  
      // Respond with success message and updated user
      res.status(200).json({ message: 'Employee assigned successfully.', user });
    } catch (error) {
      console.error('Error assigning employee:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };
  