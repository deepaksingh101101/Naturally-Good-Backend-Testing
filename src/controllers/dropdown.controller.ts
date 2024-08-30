import { Request, Response } from 'express';
import { RosterModel, SeasonModel, SubscriptionTypeModel, FrequencyTypeModel, RoleTypeModel, ProductTypeModel } from '../models/dropdown.model';

// Common function to handle errors
const handleError = (res: Response, error: any) => {
  res.status(500).json({ error: 'Internal server error' });
};


// Create a new ProductType
export const createProductType = async (req: Request, res: Response) => {
  try {
    const { Name, SortOrder } = req.body;
    const loggedInId = req['decodedToken'];

    // Check if required fields are present
    if (!Name || SortOrder === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if Name already exists (ignoring case)
    const existingName = await ProductTypeModel.findOne({ Name: { $regex: new RegExp(`^${Name}$`, 'i') } });
    if (existingName) {
      return res.status(400).json({ error: 'Name already exists' });
    }

    // Check if SortOrder already exists
    const existingSortOrder = await ProductTypeModel.findOne({ SortOrder: SortOrder });
    if (existingSortOrder) {
      return res.status(400).json({ error: 'Sort order already exists' });
    }

    // Create new ProductType
    const newProductType = new ProductTypeModel({ Name, SortOrder, CreatedBy:loggedInId,UpdatedBy:loggedInId});
    await newProductType.save();
    res.status(201).json(newProductType);
  } catch (error) {
    handleError(res, error);
  }
};
// Get all Product Types
export const getTypes = async (req: Request, res: Response) => {
  try {
    const types = await ProductTypeModel.find();
    return res.json(types);
  } catch (error) {
    handleError(res, error);
  }
};
// Delete a ProductType by ID
export const deleteProductType = async (req: Request, res: Response) => {
  try {
    const type = await ProductTypeModel.findByIdAndDelete(req.params.id);
    if (!type) {
      return res.status(404).json({ error: 'Type not found' });
    }
    return res.status(204).json({ message: 'Type deleted' });
  } catch (error) {
    handleError(res, error);
  }
};

// Edit a Product Type
export const editProductType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Name, SortOrder } = req.body;
    const loggedInId = req['decodedToken'];

    // Find the existing ProductType by ID
    const existingProductType = await ProductTypeModel.findById(id);
    if (!existingProductType) {
      return res.status(404).json({ error: 'ProductType not found' });
    }

    // Check if Name is provided and is not the same as the current one (ignoring case)
    if (Name) {
      const existingName = await ProductTypeModel.findOne({
        _id: { $ne: id }, 
        Name: { $regex: new RegExp(`^${Name}$`, 'i') }, // Case insensitive match
      });
      if (existingName) {
        return res.status(400).json({ error: 'Name already exists' });
      }
      existingProductType.Name = Name;  // Update Name if provided
    }

    // Check if SortOrder is provided and is not the same as the current one
    if (SortOrder !== undefined) {
      const existingSortOrder = await ProductTypeModel.findOne({
        _id: { $ne: id }, 
        SortOrder: SortOrder,
      });
      if (existingSortOrder) {
        return res.status(400).json({ error: 'Sort order already exists' });
      }
      existingProductType.SortOrder = SortOrder;  // Update SortOrder if provided
    }

    // Update UpdatedBy if provided
      existingProductType.UpdatedBy = loggedInId;
    // Always update the UpdatedAt field
    existingProductType.UpdatedAt = new Date();

    // Save the changes
    await existingProductType.save();

    // Respond with the updated ProductType
    res.status(200).json(existingProductType);
  } catch (error) {
    handleError(res, error);
  }
};
