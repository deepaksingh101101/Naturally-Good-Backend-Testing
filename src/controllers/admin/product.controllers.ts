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


export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const currentpage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentpage - 1) * limit;

        const products = await ProductModel.find().skip(skip).limit(limit);
        const total = await ProductModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const prevPage = currentpage > 1;
        const nextPage = currentpage < totalPages;

        res.status(200).json({
            total,
            currentpage,
            totalpages: totalPages,
            prevPage,
            nextPage,
            products
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }

        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};