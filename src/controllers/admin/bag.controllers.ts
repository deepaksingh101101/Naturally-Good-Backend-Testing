import { Request, Response } from 'express';
import ProductModel from '../../models/product.model';
import { CategoryType } from '../../models/category.model';
import { BagModel } from '../../models/bag.model';
import { responseHandler } from '../../utils/send-response';

export const createBagByAdmin = async (req: Request, res: Response) => {
    try {
        const loggedInId = req['decodedToken']?.id;

        const {
            BagName,
            BagMaxWeight,
            BagVisibility,
            Status,
            BagImageUrl,
            BagDescription,
            AllowedItems, // Array of Product IDs
        } = req.body;

        // Validate input
        if (!BagName || !BagMaxWeight || !BagVisibility || !Status || !AllowedItems) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Missing required fields'
            });
        }

        // Validate allowedItems - check if all product IDs are valid
        const products = await ProductModel.find({ _id: { $in: AllowedItems } });
        if (products.length !== AllowedItems.length) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Some products not found'
            });
        }

        // Create a new Bag
        const bag = new BagModel({
            BagName,
            BagMaxWeight,
            BagVisibility,
            Status,
            BagImageUrl,
            BagDescription,
            AllowedItems,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId,
        });

        console.log(bag)

        await bag.save();
        return responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: 'Bag created successfully',
            data: bag
        });
    } catch (error) {
        console.log(error)
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

export const getAllBags = async (req: Request, res: Response) => {
    try {
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        // Find all bags with pagination and populate necessary fields
        const bags = await BagModel.find()
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'AllowedItems' // Adjust the fields you want to select from Product
            });

        const total = await BagModel.countDocuments(); // Total count of bags
        const totalPages = Math.ceil(total / limit); // Calculate total pages

        // Determine if there are previous and next pages
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        // Respond with paginated data
        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Bags retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                bags
            }
        });
    } catch (error) {
        console.error('Error retrieving bags:', error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

export const updateBag = async (req: Request, res: Response) => {
    try {
        const loggedInId = req['decodedToken']?.id;

        const { id } = req.params;
        const {
            AllowedItems, // Array of Product IDs
        } = req.body;

        // Check if Bag exists
        const bag = await BagModel.findById(id);
        if (!bag) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Bag not found'
            });
        }

        // Validate allowedItems - check if all product IDs are valid
        if (AllowedItems) {
            const products = await ProductModel.find({ _id: { $in: AllowedItems } });
            if (products.length !== AllowedItems.length) {
                return responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Some products not found'
                });
            }
        }

        // Update the Bag using findByIdAndUpdate with additional fields
        const updatedBag = await BagModel.findByIdAndUpdate(
            id,
            {
                ...req.body, // Spread the fields from req.body
                UpdatedBy: loggedInId, // Add or update additional fields
            },
            {
                new: true, // Return the updated document
                runValidators: true, // Run validation checks
            }
        );

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Bag updated successfully',
            data: updatedBag
        });
    } catch (error) {
        console.error('Error updating bag:', error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

export const getOneBag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if the ID is valid
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid bag ID format'
            });
        }

        // Find the Bag by ID and populate necessary fields
        const bag = await BagModel.findById(id)
            .populate({
                path: 'AllowedItems',
                populate: [
                    {
                        path: 'Type',
                        select: 'Name'
                    },
                    {
                        path: 'Season',
                        select: 'Name'
                    },
                    {
                        path: 'Roster',
                        select: 'Name'
                    }
                ]
            })
            .populate('CreatedBy', 'FirstName LastName PhoneNumber Email')
            .populate('UpdatedBy', 'FirstName LastName PhoneNumber Email')

        if (!bag) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Bag not found'
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Bag retrieved successfully',
            data: bag
        });
    } catch (error) {
        console.error('Error fetching bag:', error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

export const toggleBagStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { Status } = req.body;
        const loggedInId = req['decodedToken']?.id;

        // Validate bag ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid bag ID format'
            });
        }

        // Validate Status field
        if (typeof Status !== 'boolean') {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid value for Status. It must be true or false.'
            });
        }

        // Update the Status field
        const bag = await BagModel.findByIdAndUpdate(
            id,
            { Status, UpdatedBy: loggedInId },
            { new: true, runValidators: true }
        );

        if (!bag) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Bag not found'
            });
        }

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Bag status updated successfully',
            data: bag
        });
    } catch (error) {
        console.error('Error updating bag status:', error);
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

export const deleteBag = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Validate bag ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid bag ID format'
            });
        }

        // Find and delete the Bag by ID
        const deletedBag = await BagModel.findByIdAndDelete(id);
        if (!deletedBag) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Bag not found'
            });
        }

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Bag deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting bag:', error);
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
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


