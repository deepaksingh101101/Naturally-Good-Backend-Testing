import { Request, Response } from 'express';
import CategoryModel, { CategoryType } from '../../models/category.model';


// Create Category
export const createCategory = async (req: Request, res: Response) => {
    const { Type, Name, Description, Children } = req.body;
    const AdminId = req['adminId'];
    if(!AdminId){
        return res.status(400).json({ error: 'Admin Id not found' });
    }
    // Manual validation for Name field
    if (!Name || typeof Name !== 'string') {
        return res.status(400).json({ error: 'Name is required and must be a string' });
    }
    
    // Manual validation for Type field
    if (Type && !Object.values(CategoryType).includes(Type)) {
        return res.status(400).json({ error: `Type must be one of the following: ${Object.values(CategoryType).join(', ')}` });
    }

    // Manual validation for Children field
    if (Children && !Array.isArray(Children)) {
        return res.status(400).json({ error: 'Children must be an array of category objects' });
    }

    try {
        // Validate Children (recursive check if necessary)
        if (Children) {
            for (const child of Children) {
                if (!child.Name || typeof child.Name !== 'string') {
                    return res.status(400).json({ error: 'Each child category must have a valid Name' });
                }
                if (child.Type && !Object.values(CategoryType).includes(child.Type)) {
                    return res.status(400).json({ error: `Child category Type must be one of the following: ${Object.values(CategoryType).join(', ')}` });
                }
            }
        }

        // Create a new category
        const newCategory = new CategoryModel({
            Type,
            Name,
            Description,
            Children,
            createdBy:AdminId,
        });

        // Save the category to the database
        await newCategory.save();

        // Respond with the newly created category
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await CategoryModel.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete Category
export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params; // Assuming you pass the category ID in the URL params

    try {
        // Find and delete the category by ID
        const category = await CategoryModel.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update Category
export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params; // Category ID from the URL
    const { Type, Name, Description, Children, updatedBy } = req.body;

    try {
        // Find the existing category
        const category = await CategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Manual validation for Name field
        if (Name && typeof Name !== 'string') {
            return res.status(400).json({ error: 'Name must be a string' });
        }
        
        // Manual validation for Type field
        if (Type && !Object.values(CategoryType).includes(Type)) {
            return res.status(400).json({ error: `Type must be one of the following: ${Object.values(CategoryType).join(', ')}` });
        }

        // Manual validation for Children field
        if (Children && !Array.isArray(Children)) {
            return res.status(400).json({ error: 'Children must be an array of category objects' });
        }

        // Validate Children (recursive check if necessary)
        if (Children) {
            for (const child of Children) {
                if (!child.Name || typeof child.Name !== 'string') {
                    return res.status(400).json({ error: 'Each child category must have a valid Name' });
                }
                if (child.Type && !Object.values(CategoryType).includes(child.Type)) {
                    return res.status(400).json({ error: `Child category Type must be one of the following: ${Object.values(CategoryType).join(', ')}` });
                }
            }
        }

        // Update the category fields
        category.Type = Type || category.Type;
        category.Name = Name || category.Name;
        category.Description = Description || category.Description;
        category.Children = Children || category.Children;
        
        // Save the updated category to the database
        await category.save();

        // Respond with the updated category
        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get One Category By Id
export const getCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params; // Category ID from the URL

    try {
        // Find the category by ID
        const category = await CategoryModel.findById(id);

        // Check if the category exists
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Respond with the found category
        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};