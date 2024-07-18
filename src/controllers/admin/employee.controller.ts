import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import DeliveryGuyModel from '../../models/employee.model';
import jwt from 'jsonwebtoken';

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