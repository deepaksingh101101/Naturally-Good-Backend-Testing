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


// Starting Roster
export const createRoster = async (req: Request, res: Response) => {
  try {
    const { Name, SortOrder } = req.body;
    const loggedInId = req['decodedToken'];

    // Check if required fields are present
    if (!Name || SortOrder === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if Name already exists (ignoring case)
    const existingName = await RosterModel.findOne({ Name: { $regex: new RegExp(`^${Name}$`, 'i') } });
    if (existingName) {
      return res.status(400).json({ error: 'Name already exists' });
    }

    // Check if SortOrder already exists
    const existingSortOrder = await RosterModel.findOne({ SortOrder: SortOrder });
    if (existingSortOrder) {
      return res.status(400).json({ error: 'Sort order already exists' });
    }

    // Create new Roster
    const newRoster = new RosterModel({ Name, SortOrder, CreatedBy: loggedInId, UpdatedBy: loggedInId });
    await newRoster.save();
    res.status(201).json(newRoster);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

//get all roster 
export const getRosters = async (req: Request, res: Response) => {
  try {
    const rosters = await RosterModel.find();
    return res.json(rosters);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete roster
export const deleteRoster = async (req: Request, res: Response) => {
  try {
    const roster = await RosterModel.findByIdAndDelete(req.params.id);
    if (!roster) {
      return res.status(404).json({ error: 'Roster not found' });
    }
    return res.status(204).json({ message: 'Roster deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Edit roster
export const editRoster = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Name, SortOrder } = req.body;
    const loggedInId = req['decodedToken'];

    // Find the existing Roster by ID
    const existingRoster = await RosterModel.findById(id);
    if (!existingRoster) {
      return res.status(404).json({ error: 'Roster not found' });
    }

    // Check if Name is provided and is not the same as the current one (ignoring case)
    if (Name) {
      const existingName = await RosterModel.findOne({
        _id: { $ne: id }, 
        Name: { $regex: new RegExp(`^${Name}$`, 'i') }, // Case insensitive match
      });
      if (existingName) {
        return res.status(400).json({ error: 'Name already exists' });
      }
      existingRoster.Name = Name;  // Update Name if provided
    }

    // Check if SortOrder is provided and is not the same as the current one
    if (SortOrder !== undefined) {
      const existingSortOrder = await RosterModel.findOne({
        _id: { $ne: id }, 
        SortOrder: SortOrder,
      });
      if (existingSortOrder) {
        return res.status(400).json({ error: 'Sort order already exists' });
      }
      existingRoster.SortOrder = SortOrder;  // Update SortOrder if provided
    }

    // Update UpdatedBy if provided
    existingRoster.UpdatedBy = loggedInId;
    // Always update the UpdatedAt field
    existingRoster.UpdatedAt = new Date();

    // Save the changes
    await existingRoster.save();

    // Respond with the updated Roster
    res.status(200).json(existingRoster);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Create a new Season
export const createSeason = async (req: Request, res: Response) => {
  try {
    const { Name } = req.body;
    const loggedInId = req['decodedToken'];

    // Check if required fields are present
    if (!Name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check if Name already exists (ignoring case)
    const existingSeason = await SeasonModel.findOne({ Name: { $regex: new RegExp(`^${Name}$`, 'i') } });
    if (existingSeason) {
      return res.status(400).json({ error: 'Season name already exists' });
    }

    // Create new Season
    const newSeason = new SeasonModel({ 
      Name, 
      CreatedBy: loggedInId, 
      UpdatedBy: loggedInId 
    });
    await newSeason.save();
    res.status(201).json(newSeason);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all Seasons
export const getSeasons = async (req: Request, res: Response) => {
  try {
    const seasons = await SeasonModel.find() // Populate with Employee name
    return res.json(seasons);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a Season by ID
export const deleteSeason = async (req: Request, res: Response) => {
  try {
    const season = await SeasonModel.findByIdAndDelete(req.params.id);
    if (!season) {
      return res.status(404).json({ error: 'Season not found' });
    }
    return res.status(204).json({ message: 'Season deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Edit a Season
export const editSeason = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Name } = req.body;
    const loggedInId = req['decodedToken'];

    // Find the existing Season by ID
    const existingSeason = await SeasonModel.findById(id);
    if (!existingSeason) {
      return res.status(404).json({ error: 'Season not found' });
    }

    // Check if Name is provided and is not the same as the current one (ignoring case)
    if (Name) {
      const existingName = await SeasonModel.findOne({
        _id: { $ne: id }, 
        Name: { $regex: new RegExp(`^${Name}$`, 'i') }, // Case insensitive match
      });
      if (existingName) {
        return res.status(400).json({ error: 'Season name already exists' });
      }
      existingSeason.Name = Name;  // Update Name if provided
    }

    // Update UpdatedBy and UpdatedAt fields
    existingSeason.UpdatedBy = loggedInId;
    existingSeason.UpdatedAt = new Date();

    // Save the changes
    await existingSeason.save();

    // Respond with the updated Season
    res.status(200).json(existingSeason);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Create Subscription Type

export const getSubscriptionTypes = async (req: Request, res: Response) => {
  try {
    const subscriptionTypes = await SubscriptionTypeModel.find();
    return res.json(subscriptionTypes);
  } catch (error) {
    handleError(res, error);
  }
};

export const createSubscriptionType = async (req: Request, res: Response) => {
  try {
    const { Name, Value } = req.body;
    const loggedInId = req['decodedToken']; // Get logged-in user ID

    if (!Name || Value === undefined || !loggedInId) {
      return res.status(400).json({ error: 'Missing required fields or user ID' });
    }

    const name = Name.toLowerCase();

    // Check if subscription type with the same name already exists
    const existing = await SubscriptionTypeModel.findOne({ Name: name });
    if (existing) {
      return res.status(400).json({ error: 'Subscription Type already exists' });
    }

    const newSubscriptionType = new SubscriptionTypeModel({
      Name: name,
      Value,
      CreatedBy: loggedInId,
      UpdatedBy: loggedInId
    });

    await newSubscriptionType.save();
    res.status(201).json(newSubscriptionType);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteSubscriptionType = async (req: Request, res: Response) => {
  try {
    const subscriptionType = await SubscriptionTypeModel.findByIdAndDelete(req.params.id);
    if (!subscriptionType) {
      return res.status(404).json({ error: 'Subscription Type not found' });
    }
    return res.status(204).json({ message: 'Subscription Type deleted' });
  } catch (error) {
    handleError(res, error);
  }
};

export const editSubscriptionType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Name, Value } = req.body;
    const loggedInId = req['decodedToken']; // Get logged-in user ID

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid subscription type ID format' });
    }

    // Check if the logged-in user ID is available
    if (!loggedInId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Prepare update object
    const updateData: any = { UpdatedBy: loggedInId };

    // If Name is provided, validate and include it in the update
    if (Name) {
      const name = Name.toLowerCase();
      const existing = await SubscriptionTypeModel.findOne({ Name: name, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ error: 'Subscription Type with this name already exists' });
      }
      updateData.Name = name;
    }

    // If Value is provided, include it in the update
    if (Value !== undefined) {
      updateData.Value = Value;
    }

    // Find and update the subscription type
    const updatedSubscriptionType = await SubscriptionTypeModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSubscriptionType) {
      return res.status(404).json({ error: 'Subscription Type not found' });
    }

    return res.status(200).json(updatedSubscriptionType);
  } catch (error) {
    handleError(res, error);
  }
};


// Frequency Type
export const getFrequencyTypes = async (req: Request, res: Response) => {
  try {
    const frequencyTypes = await FrequencyTypeModel.find();
    return res.status(200).json(frequencyTypes);
  } catch (error) {
    handleError(res, error);
  }
};


export const createFrequencyType = async (req: Request, res: Response) => {
  try {
    const { Name, Value } = req.body;
    
    if (!Name || Value === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if Frequency Type with the same name exists (case-insensitive)
    const existing = await FrequencyTypeModel.findOne({ 
      Name: { $regex: new RegExp(`^${Name}$`, 'i') } 
    });

    if (existing) {
      return res.status(400).json({ error: 'Frequency Type already exists' });
    }

    // Create and save the new Frequency Type
    const newFrequencyType = new FrequencyTypeModel({ Name, Value });
    await newFrequencyType.save();
    
    res.status(201).json(newFrequencyType);
  } catch (error) {
    handleError(res, error);
  }
};



export const editFrequencyType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Name, Value } = req.body;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid frequency type ID format' });
    }

    // Prepare update object
    const updateData: any = {};

    // If Name is provided, validate and include it in the update
    if (Name) {
      // Check if a Frequency Type with the same name already exists (case-insensitive)
      const existing = await FrequencyTypeModel.findOne({
        Name: { $regex: new RegExp(`^${Name}$`, 'i') },
        _id: { $ne: id }
      });

      if (existing) {
        return res.status(400).json({ error: 'Frequency Type with this name already exists' });
      }
      
      updateData.Name = Name; // Use the provided name as is
    }

    // If Value is provided, include it in the update
    if (Value !== undefined) {
      updateData.Value = Value;
    }

    // Find and update the frequency type
    const updatedFrequencyType = await FrequencyTypeModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedFrequencyType) {
      return res.status(404).json({ error: 'Frequency Type not found' });
    }

    return res.status(200).json(updatedFrequencyType);
  } catch (error) {
    handleError(res, error);
  }
};


export const deleteFrequencyType = async (req: Request, res: Response) => {
  try {
    const frequencyType = await FrequencyTypeModel.findByIdAndDelete(req.params.id);
    if (!frequencyType) {
      return res.status(404).json({ error: 'Frequency Type not found' });
    }
    return res.status(204).json({ message: 'Frequency Type deleted' });
  } catch (error) {
    handleError(res, error);
  }
};