import { Request, Response } from 'express';
import ProductModel from '../../models/product.model';
import { CategoryType } from '../../models/category.model';
import { responseHandler } from '../../utils/send-response';
import { ProductTypeModel, RosterModel, SeasonModel } from '../../models/dropdown.model';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const loggedInId = req['decodedToken']?.id;
        const { ProductName,Type, Season,Roster } = req.body;


        const isRosterExist=await RosterModel.findById(Roster)
        if(!isRosterExist){
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Roster not found'
            });
        }
        const isTypeExist=await ProductTypeModel.findById(Type)
        if(!isTypeExist){
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Product Type not found'
            });
        }
        const isSeasonExist=await SeasonModel.findById({_id:Season})
        if(!isSeasonExist){
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Season  not found'
            });
        }

        const trimmedProductName = ProductName.trim(); // Trim whitespace from the input

        const existingProduct = await ProductModel.findOne({ 
            ProductName: { $regex: new RegExp(`^${trimmedProductName}$`, 'i') } 
        });



        if (existingProduct) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 409,
                message: 'Product name already exists'
            });
        }

        const product = new ProductModel({
            ...req.body,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId,
        });

        await product.save();
        responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        const products = await ProductModel.find()
            .skip(skip)
            .limit(limit)
            .populate('Type', 'Name')
            .populate('Season', 'Name')
            .populate('Roster', 'Name')
            .populate('CreatedBy', 'Email')
            .populate('UpdatedBy', 'Email');

        const total = await ProductModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Products retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                products,
            }
        });
    } catch (error) {
        console.error(error);
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid product ID format'
            });
        }

        const product = await ProductModel.findById(id)
            .populate('Type', 'Name')
            .populate('Season', 'Name')
            .populate('Roster', 'Name')
            .populate('CreatedBy', 'Email FirstName LastName PhoneNumber')
            .populate('UpdatedBy', 'Email FirstName LastName PhoneNumber');

        if (!product) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Product not found'
            });
        }

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Product retrieved successfully',
            data: product
        });
    } catch (error) {
        console.error(error);
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const loggedInId = req['decodedToken']?.id;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid product ID format'
            });
        }

        const product = await ProductModel.findByIdAndUpdate(
            id,
            { ...req.body, UpdatedBy: loggedInId, UpdatedAt: new Date().toISOString() },
            { new: true, runValidators: true }
        );

        if (!product) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Product not found'
            });
        }

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

export const toggleProductAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { Available } = req.body;
        const loggedInId = req['decodedToken']?.id;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid product ID format'
            });
        }

        if (typeof Available !== 'boolean') {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid value for Available. It must be true or false.'
            });
        }

        const product = await ProductModel.findByIdAndUpdate(
            id,
            { Available, UpdatedBy: loggedInId, UpdatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!product) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Product not found'
            });
        }

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Product availability toggled successfully',
            data: product
        });
    } catch (error) {
        console.error(error);
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid product ID format'
            });
        }

        const product = await ProductModel.findByIdAndDelete(id);

        if (!product) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Product not found'
            });
        }

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

export const filterProducts = async (req: Request, res: Response) => {
    try {
        const filters = req.query;
        const pipeline: any[] = [];
        
        // Pagination setup
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        // ProductName filter using regex for case-insensitive match
        if (filters.ProductName) {
            pipeline.push({
                $match: {
                    ProductName: { $regex: new RegExp(filters.ProductName as string, 'i') },
                },
            });
        }

        // Type filter based on ProductType name
        if (filters.Type) {
            pipeline.push({
                $lookup: {
                    from: 'producttypes',
                    localField: 'Type',
                    foreignField: '_id',
                    as: 'TypeInfo',
                },
            });
        }

        // Season filter based on Season name
        if (filters.Season) {
            pipeline.push({
                $lookup: {
                    from: 'seasons',
                    localField: 'Season',
                    foreignField: '_id',
                    as: 'SeasonInfo',
                },
            });
        }

        // Roster filter based on Roster name
        if (filters.Roster) {
            pipeline.push({
                $lookup: {
                    from: 'rosters',
                    localField: 'Roster',
                    foreignField: '_id',
                    as: 'RosterInfo',
                },
            });
        }

        // Add a single match stage after all lookups
        const matchConditions: any = {};

        if (filters.Type) {
            matchConditions['TypeInfo.Name'] = filters.Type;
        }

        if (filters.Season) {
            matchConditions['SeasonInfo.Name'] = filters.Season;
        }

        if (filters.Roster) {
            matchConditions['RosterInfo.Name'] = filters.Roster;
        }

        if (filters.Group) {
            matchConditions.Group = filters.Group;
        }

        if (Object.keys(matchConditions).length > 0) {
            pipeline.push({ $match: matchConditions });
        }

        // Add pagination to the pipeline
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        // Execute the aggregation pipeline
        const products = await ProductModel.aggregate(pipeline);

        const total = await ProductModel.countDocuments(); // Total documents count for pagination
        const totalPages = Math.ceil(total / limit); // Total number of pages

        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        if (products.length === 0) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'No products found matching the criteria.',
            });
        }

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Products retrieved successfully',
            data:{
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                products,
            }
        });
    } catch (error) {
        console.error(error);
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
};


// export const updateProductCategory = async (req: Request, res: Response) => {
//     try {
//         const {productId}=req.query;
//       const {  newCategory } = req.body;
  
//       // Validate the new category
//       if (!Object.values(CategoryType).includes(newCategory)) {
//         return res.status(400).json({ message: 'Invalid category type' });
//       }
  
//       // Find the product by ID
//       const product = await ProductModel.findById(productId);
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }
  
//       // Update the product's category
//       product.Category = newCategory;
//       await product.save();
  
//       // Return a success response
//       return res.status(200).json({ message: 'Product category updated successfully', product });
//     } catch (error) {
//       return res.status(500).json({ message: 'Internal server error', error });
//     }
//   };





