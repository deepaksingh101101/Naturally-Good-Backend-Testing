import { Request, Response } from 'express';
import ProductModel from '../../models/product.model';
import { CategoryType } from '../../models/category.model';

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



export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const AdminId = req['adminId'];

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }

        const product = await ProductModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: AdminId, UpdatedAt: new Date().toISOString() },
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

        if (filters.ProductName) {
            query.ProductName = { $regex: new RegExp(filters.ProductName as string, 'i') }; 
        }
        if (filters.Type) {
            query.Type = filters.Type;
        }
        if (filters.Season) {
            query.Season = filters.Season;
        }
        if (filters.Price) {
            query.Price = +filters.Price;
        }
        if (filters.Stock) {
            query.Stock = +filters.Stock;
        }

        const products = await ProductModel.find(query);
        
        if (products.length === 0) {
            return res.status(404).json({ error: 'Products not found' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const updateProductCategory = async (req: Request, res: Response) => {
    try {
        const {productId}=req.query;
      const {  newCategory } = req.body;
  
      // Validate the new category
      if (!Object.values(CategoryType).includes(newCategory)) {
        return res.status(400).json({ message: 'Invalid category type' });
      }
  
      // Find the product by ID
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Update the product's category
      product.Category = newCategory;
      await product.save();
  
      // Return a success response
      return res.status(200).json({ message: 'Product category updated successfully', product });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  };