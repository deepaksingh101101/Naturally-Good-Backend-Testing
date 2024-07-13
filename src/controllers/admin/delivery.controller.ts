import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import DeliveryGuyModel from '../../models/delivery.model';
import jwt from 'jsonwebtoken';

export const createDeliveryGuy = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    const adminId = req['adminId'];

    try {
        const deliveryGuyExists = await DeliveryGuyModel.findOne({ email });
        if (deliveryGuyExists) {
            return res.status(400).json({ error: 'Delivery guy already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDeliveryGuy = new DeliveryGuyModel({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            adminId,
            role: 'delivery_guy',
            updatedAt: new Date(),
            createdAt: new Date(),
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
    const { email, password } = req.body;

    try {
        const deliveryGuy = await DeliveryGuyModel.findOne({ email });

        if (!deliveryGuy) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const isPasswordValid = await bcrypt.compare(password, deliveryGuy.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: deliveryGuy._id, role: deliveryGuy.role },
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
    const { email, password, firstName, lastName, phoneNumber, isActive } = req.body;

    if (email) {
        return res.status(400).json({ error: 'Email cannot be changed' });
    }

    try {
        const deliveryGuy = await DeliveryGuyModel.findById(id);
        if (!deliveryGuy) {
            return res.status(404).json({ error: 'Delivery guy not found' });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            deliveryGuy.password = hashedPassword;
        }

        if (firstName) deliveryGuy.firstName = firstName;
        if (lastName) deliveryGuy.lastName = lastName;
        if (phoneNumber) deliveryGuy.phoneNumber = phoneNumber;
        if (typeof isActive !== 'undefined') deliveryGuy.isActive = isActive;

        deliveryGuy.updatedAt = new Date();

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