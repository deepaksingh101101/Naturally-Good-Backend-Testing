import { Request, Response } from 'express';
import ProductModel from '../../models/product.model';
import { CategoryType } from '../../models/category.model';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const loggedInId = req['decodedToken']?.id
                const { ProductName } = req.body;

        // Check if a product with the same name already exists (case insensitive)
        const existingProduct = await ProductModel.findOne({ 
            ProductName: { $regex: new RegExp('^' + ProductName + '$', 'i') } 
        });
        if (existingProduct) {
            return res.status(400).json({ error: 'Product name already exists' });
        }

        const product = new ProductModel({
            ...req.body,
            CreatedBy: loggedInId ,
            UpdatedBy: loggedInId ,
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllProducts = async (req: Request, res: Response) => {
    try {
      const currentPage = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (currentPage - 1) * limit;
  
      // Find all products with pagination and populate necessary fields
      const products = await ProductModel.find()
        .skip(skip)
        .limit(limit)
        .populate('Type', 'Name') // Populate Type with only the 'Name' field
        .populate('Season', 'Name') // Populate Season with only the 'Name' field
        .populate('Roster', 'Name') // Populate Roster with only the 'Name' field
        .populate('CreatedBy', 'Email') // Populate CreatedBy with 'Name' and 'Email' fields only
        .populate('UpdatedBy', 'Email'); // Populate CreatedBy with 'Name' and 'Email' fields only
  
      const total = await ProductModel.countDocuments(); // Total count of products
      const totalPages = Math.ceil(total / limit); // Calculate total pages
  
      // Determine if there are previous and next pages
      const prevPage = currentPage > 1;
      const nextPage = currentPage < totalPages;
  
      // Respond with paginated data
      res.status(200).json({
        total,
        currentPage,
        totalPages,
        prevPage,
        nextPage,
        products,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  


export const getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(req.params);
      
      // Validate the product ID format
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid product ID format' });
      }
  
      // Find product by ID and populate the related fields
      const product = await ProductModel.findById(id)
        .populate('Type', 'Name') // Populate Type with only the 'Name' field
        .populate('Season', 'Name') // Populate Season with only the 'Name' field
        .populate('Roster', 'Name') // Populate Roster with only the 'Name' field
        .populate('CreatedBy', 'Email') // Populate CreatedBy with 'Name' and 'Email' fields only
        .populate('UpdatedBy', 'Email'); // Populate CreatedBy with 'Name' and 'Email' fields only

  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  



export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const loggedInId = req['decodedToken']?.id


        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }

        const product = await ProductModel.findByIdAndUpdate(
            id,
            { ...req.body, UpdatedBy: loggedInId, UpdatedAt: new Date().toISOString() },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const toggleProductAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { Available } = req.body;
        const loggedInId = req['decodedToken']?.id;

        // Validate product ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }

        // Validate Available field
        if (typeof Available !== 'boolean') {
            return res.status(400).json({ error: 'Invalid value for Available. It must be true or false.' });
        }

        // Update the Available field
        const product = await ProductModel.findByIdAndUpdate(
            id,
            { Available, UpdatedBy: loggedInId, UpdatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }

        const product = await ProductModel.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const filterProducts = async (req: Request, res: Response) => {
    try {
        const filters = req.query;
        const query: any = {};

        // Initialize aggregation pipeline
        const pipeline: any[] = [];

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
                    from: 'producttypes', // Collection name of ProductType
                    localField: 'Type', // Field in Product schema
                    foreignField: '_id', // Field in ProductType schema
                    as: 'TypeInfo', // Output array field
                },
            });
            pipeline.push({
                $match: {
                    'TypeInfo.Name': filters.Type, // Match the ProductType Name
                },
            });
        }

        // Season filter based on Season name
        if (filters.Season) {
            pipeline.push({
                $lookup: {
                    from: 'seasons', // Collection name of Season
                    localField: 'Season', // Field in Product schema
                    foreignField: '_id', // Field in Season schema
                    as: 'SeasonInfo', // Output array field
                },
            });
            pipeline.push({
                $match: {
                    'SeasonInfo.Name': filters.Season, // Match the Season Name
                },
            });
        }

        // Roster filter based on Roster name
        if (filters.Roster) {
            pipeline.push({
                $lookup: {
                    from: 'rosters', // Collection name of Roster
                    localField: 'Roster', // Field in Product schema
                    foreignField: '_id', // Field in Roster schema
                    as: 'RosterInfo', // Output array field
                },
            });
            pipeline.push({
                $match: {
                    'RosterInfo.Name': filters.Roster, // Match the Roster Name
                },
            });
        }

        // Group filter (direct match since Group is a field in Product)
        if (filters.Group) {
            pipeline.push({
                $match: {
                    Group: filters.Group,
                },
            });
        }

        // Execute the aggregation pipeline
        const products = await ProductModel.aggregate(pipeline);

        if (products.length === 0) {
            return res.status(404).json({ error: 'Products not found' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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





