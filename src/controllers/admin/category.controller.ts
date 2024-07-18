import { Request, Response } from 'express';
import CategoryModel from '../../models/category.model';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = new CategoryModel(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
