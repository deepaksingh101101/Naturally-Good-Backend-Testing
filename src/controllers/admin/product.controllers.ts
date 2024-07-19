import { Request, Response } from 'express';
import ProductModel from '../../models/product.model';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const AdminId = req['adminId'];

        const product = new ProductModel({
            ...req.body,
            createdBy: AdminId 
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
