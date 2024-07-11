import { Request, Response } from 'express';
import VegetableModel, { Category } from '../models/vegetable.model';


export const createVegetable = async (req: Request, res: Response) => {
    try {
      const adminId = req.params.adminId;
      if (!adminId) {
        return res.status(400).json({ error: 'Admin ID is required' });
      }
  
      const vegetableData = req.body;
  
      // Validate vegetableCategory
      const validCategories = Object.values(Category);
      if (vegetableData.vegetableCategory && !validCategories.includes(vegetableData.vegetableCategory)) {
        return res.status(400).json({ error: `Invalid vegetableCategory: ${vegetableData.vegetableCategory}` });
      }
  
      const vegetable = new VegetableModel({ ...vegetableData, adminId });
      await vegetable.save();
      res.status(201).json(vegetable);
    } catch (error) {
      console.error('Error creating vegetable:', error);  // Log the error for debugging
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };