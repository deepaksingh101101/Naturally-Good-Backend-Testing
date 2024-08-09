import { Request, Response } from 'express';
import ProductModel from '../../models/product.model';
import { CategoryType } from '../../models/category.model';
import { BagModel } from '../../models/bag.model';

export const createBagByAdmin = async (req: Request, res: Response) => {
    try {
        const AdminId = req['adminId']; // Admin ID from request
        const {
            bagName,
            bagMaxWeight,
            bagVisibility,
            status,
            bagImageUrl,
            bagDescription,
            allowedItems, // Array of Product IDs
        } = req.body;

        // Validate input
        if (!bagName || !bagMaxWeight || !bagVisibility || !status || !allowedItems ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate allowedItems - check if all product IDs are valid
        const products = await ProductModel.find({ _id: { $in: allowedItems } });
        if (products.length !== allowedItems.length) {
            return res.status(400).json({ error: 'Some products not found' });
        }

        // Create a new Bag
        const bag = new BagModel({
            bagName,
            bagMaxWeight,
            bagVisibility,
            status,
            bagImageUrl,
            bagDescription,
            allowedItems,
            CreatedBy:AdminId,
        });

        await bag.save();
        res.status(201).json(bag);
    } catch (error) {
        console.error('Error creating bag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllBags = async (req: Request, res: Response) => {
    try {
        const bags = await BagModel.find().populate('allowedItems'); 
        res.status(200).json(bags);
    } catch (error) {
        console.error('Error retrieving bags:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateBag = async (req: Request, res: Response) => {
    try {
        const AdminId = req['adminId']; // Admin ID from request

        const { id } = req.params;
        const {
            allowedItems, // Array of Product IDs
        } = req.body;

        // Check if Bag exists
        const bag = await BagModel.findById(id);
        if (!bag) {
            return res.status(404).json({ error: 'Bag not found' });
        }

        // Validate allowedItems - check if all product IDs are valid
        if (allowedItems) {
            const products = await ProductModel.find({ _id: { $in: allowedItems } });
            if (products.length !== allowedItems.length) {
                return res.status(400).json({ error: 'Some products not found' });
            }
        }

        // Update the Bag using findByIdAndUpdate with additional fields
        const updatedBag = await BagModel.findByIdAndUpdate(
            id,
            {
                ...req.body, // Spread the fields from req.body
                updatedBy: AdminId, // Add or update additional fields
                UpdatedAt: new Date().toISOString(),
            },
            {
                new: true, // Return the updated document
                runValidators: true, // Run validation checks
            }
        );

        res.status(200).json(updatedBag);
    } catch (error) {
        console.error('Error updating bag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getOneBag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Find the Bag by ID
        const bag = await BagModel.findById(id);
        if (!bag) {
            return res.status(404).json({ error: 'Bag not found' });
        }

        res.status(200).json(bag);
    } catch (error) {
        console.error('Error fetching bag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteBag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Find and delete the Bag by ID
        const deletedBag = await BagModel.findByIdAndDelete(id);
        if (!deletedBag) {
            return res.status(404).json({ error: 'Bag not found' });
        }

        res.status(200).json({ message: 'Bag deleted successfully' });
    } catch (error) {
        console.error('Error deleting bag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const filterBags = async (req: Request, res: Response) => {
    try {
        const filters = req.query;
        const query: any = {};

        // Apply filters based on query parameters
        if (filters.bagName) {
            query.bagName = { $regex: new RegExp(filters.bagName as string, 'i') }; 
        }
        if (filters.bagMaxWeight) {
            query.bagMaxWeight = +filters.bagMaxWeight;
        }
        if (filters.bagVisibility) {
            query.bagVisibility = filters.bagVisibility;
        }
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.bagImageUrl) {
            query.bagImageUrl = filters.bagImageUrl;
        }
    

        const bags = await BagModel.find(query);

        if (bags.length === 0) {
            return res.status(404).json({ error: 'Bags not found' });
        }

        res.status(200).json(bags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


