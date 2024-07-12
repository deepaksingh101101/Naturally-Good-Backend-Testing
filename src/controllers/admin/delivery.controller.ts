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