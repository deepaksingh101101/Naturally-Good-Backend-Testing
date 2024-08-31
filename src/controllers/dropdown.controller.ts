import { Request, Response } from 'express';
import { RosterModel, SeasonModel, SubscriptionTypeModel, FrequencyTypeModel, RoleTypeModel, ProductTypeModel } from '../models/dropdown.model';
import { responseHandler } from '../utils/send-response';

// Common function to handle errors
const handleError = (req:Request,res: Response, error: any) => {
  return responseHandler.out(req, res, {
    status: false,
    statusCode: 500,
    message: "Internal Server Error" +error.message,
});
};


// Create a new ProductType
export const createProductType = async (req: Request, res: Response) => {
  try {
    const { Name, SortOrder } = req.body;
    const loggedInId = req['decodedToken'];

    // Check if required fields are present
    if (!Name || SortOrder === undefined) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Missing required fields",
    });
      // return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if Name already exists (ignoring case)
    const existingName = await ProductTypeModel.findOne({ Name: { $regex: new RegExp(`^${Name}$`, 'i') } });
    if (existingName) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Name already exists",
    });
      // return res.status(400).json({ error: 'Name already exists' });
    }

    // Check if SortOrder already exists
    const existingSortOrder = await ProductTypeModel.findOne({ SortOrder: SortOrder });
    if (existingSortOrder) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Sort order already exists",
    });
      // return res.status(400).json({ error: 'Sort order already exists' });
    }

    // Create new ProductType
    const newProductType = new ProductTypeModel({ Name, SortOrder, CreatedBy:loggedInId,UpdatedBy:loggedInId});
    await newProductType.save();
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 201,
      message: "Created Successfully",
      data:newProductType,
  });
    // res.status(201).json(newProductType);
  } catch (error) {
    handleError(req,res, error);
  }
};
// Get all Product Types
export const getTypes = async (req: Request, res: Response) => {
  try {
    const types = await ProductTypeModel.find();
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Fetched Successfully",
      data:types,
  });
    // return res.json(types);
  } catch (error) {
    handleError(req,res, error);
  }
};
// Delete a ProductType by ID
export const deleteProductType = async (req: Request, res: Response) => {
  try {
    const type = await ProductTypeModel.findByIdAndDelete(req.params.id);
    if (!type) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Type not found",
    });
      // return res.status(404).json({ error: 'Type not found' });
    }
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 204,
      message: "Product Type deleted successfully",
  });
    // return res.status(204).json({ message: 'Type deleted' });
  } catch (error) {
    handleError(req,res, error);
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
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "ProductType not found",
    });
      // return res.status(404).json({ error: 'ProductType not found' });
    }

    // Check if Name is provided and is not the same as the current one (ignoring case)
    if (Name) {
      const existingName = await ProductTypeModel.findOne({
        _id: { $ne: id }, 
        Name: { $regex: new RegExp(`^${Name}$`, 'i') }, // Case insensitive match
      });
      if (existingName) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Name already exists",
      });
        // return res.status(400).json({ error: 'Name already exists' });
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
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Sort order already exists",
      });
        // return res.status(400).json({ error: 'Sort order already exists' });
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
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Edited Successfully",
      data:existingProductType
  });
    // res.status(200).json(existingProductType);
  } catch (error) {
    handleError(req,res, error);
  }
};


// Starting Roster
export const createRoster = async (req: Request, res: Response) => {
  try {
    const { Name, SortOrder } = req.body;
    const loggedInId = req['decodedToken'];

    // Check if required fields are present
    if (!Name || SortOrder === undefined) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Missing required fields",
    });
      // return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if Name already exists (ignoring case)
    const existingName = await RosterModel.findOne({ Name: { $regex: new RegExp(`^${Name}$`, 'i') } });
    if (existingName) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Name already exists",
    });
      // return res.status(400).json({ error: 'Name already exists' });
    }

    // Check if SortOrder already exists
    const existingSortOrder = await RosterModel.findOne({ SortOrder: SortOrder });
    if (existingSortOrder) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Sort order already exists",
    });
      // return res.status(400).json({ error: 'Sort order already exists' });
    }

    // Create new Roster
    const newRoster = new RosterModel({ Name, SortOrder, CreatedBy: loggedInId, UpdatedBy: loggedInId });
    await newRoster.save();
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 201,
      message: "Created Successfully",
      data: newRoster,
  });
    // res.status(201).json(newRoster);
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: "Internal server error" +error.message,
  });
    // res.status(500).json({ error: 'Internal server error' });
  }
};

//get all roster 
export const getRosters = async (req: Request, res: Response) => {
  try {
    const rosters = await RosterModel.find();
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Rosters fetched successfully",
      data: rosters,
  });
    // return res.json(rosters);
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: "Internal server error" +error.message,
  });
  }
};

// Delete roster
export const deleteRoster = async (req: Request, res: Response) => {
  try {
    const roster = await RosterModel.findByIdAndDelete(req.params.id);
    if (!roster) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Roster not found",
    });
      // return res.status(404).json({ error: 'Roster not found' });
    }
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 204,
      message: "Roster deleted successfully",
  });
    // return res.status(204).json({ message: 'Roster deleted' });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: "Internal server error" +error.message,
  });
    // res.status(500).json({ error: 'Internal server error' });
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
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Roster not found",
    });
      // return res.status(404).json({ error: 'Roster not found' });
    }

    // Check if Name is provided and is not the same as the current one (ignoring case)
    if (Name) {
      const existingName = await RosterModel.findOne({
        _id: { $ne: id }, 
        Name: { $regex: new RegExp(`^${Name}$`, 'i') }, // Case insensitive match
      });
      if (existingName) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Name already exists",
      });
        // return res.status(400).json({ error: 'Name already exists' });
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
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Sort order already exists",
      });
        // return res.status(400).json({ error: 'Sort order already exists' });
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
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Sort updated successfully",
      data: existingRoster,
  });
    
    // res.status(200).json(existingRoster);
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: "Internal server error" +error.message,
  });
  }
};


// Create a new Season
export const createSeason = async (req: Request, res: Response) => {
  try {
    const { Name } = req.body;
    const loggedInId = req['decodedToken'];

    // Check if required fields are present
    if (!Name) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Name is required",
    });
      // return res.status(400).json({ error: 'Name is required' });
    }

    // Check if Name already exists (ignoring case)
    const existingSeason = await SeasonModel.findOne({ Name: { $regex: new RegExp(`^${Name}$`, 'i') } });
    if (existingSeason) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Season name already exists",
    });
      // return res.status(400).json({ error: 'Season name already exists' });
    }

    // Create new Season
    const newSeason = new SeasonModel({ 
      Name, 
      CreatedBy: loggedInId, 
      UpdatedBy: loggedInId 
    });
    await newSeason.save();
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 201,
      message: "Season created successfully",
      data: newSeason,
  });
    // res.status(201).json(newSeason);
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: "Internal server error" +error.message,
  });
    // res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all Seasons
export const getSeasons = async (req: Request, res: Response) => {
  try {
    const seasons = await SeasonModel.find() // Populate with Employee name
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Season Fetched successfully",
      data: seasons

  });
    // return res.json(seasons);
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: "Internal server error" +error.message,
  });
    // res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a Season by ID
export const deleteSeason = async (req: Request, res: Response) => {
  try {
    const season = await SeasonModel.findByIdAndDelete(req.params.id);
    if (!season) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Season not found",
    });
      // return res.status(404).json({ error: 'Season not found' });
    }
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 204,
      message: "Season deleted successfully",
  });
    // return res.status(204).json({ message: 'Season deleted' });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: "Internal server error" +error.message,
  });
    // res.status(500).json({ error: 'Internal server error' });
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
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Season not found",
    });
      // return res.status(404).json({ error: 'Season not found' });
    }

    // Check if Name is provided and is not the same as the current one (ignoring case)
    if (Name) {
      const existingName = await SeasonModel.findOne({
        _id: { $ne: id }, 
        Name: { $regex: new RegExp(`^${Name}$`, 'i') }, // Case insensitive match
      });
      if (existingName) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Season name already exists",
      });
        // return res.status(400).json({ error: 'Season name already exists' });
      }
      existingSeason.Name = Name;  // Update Name if provided
    }

    // Update UpdatedBy and UpdatedAt fields
    existingSeason.UpdatedBy = loggedInId;
    existingSeason.UpdatedAt = new Date();

    // Save the changes
    await existingSeason.save();

    // Respond with the updated Season
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Season updated successfully",
      data: existingSeason,
  });
    // res.status(200).json(existingSeason);
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: "Internal server error" +error.message,
  });
    // res.status(500).json({ error: 'Internal server error' });
  }
};



// Create Subscription Type

export const getSubscriptionTypes = async (req: Request, res: Response) => {
  try {
    const subscriptionTypes = await SubscriptionTypeModel.find();
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Subscription Type Fetched successfully",
      data: subscriptionTypes
  });
    // return res.json(subscriptionTypes);
  } catch (error) {
    handleError(req,res, error);
  }
};

export const createSubscriptionType = async (req: Request, res: Response) => {
  try {
    const { Name, Value } = req.body;
    const loggedInId = req['decodedToken']; // Get logged-in user ID

    if (!Name || Value === undefined || !loggedInId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Missing required fields or user ID",
    });
      // return res.status(400).json({ error: 'Missing required fields or user ID' });
    }

    const name = Name.toLowerCase();

    // Check if subscription type with the same name already exists
    const existing = await SubscriptionTypeModel.findOne({ Name: name });
    if (existing) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Subscription Type already exists",
    });
      // return res.status(400).json({ error: 'Subscription Type already exists' });
    }

    const newSubscriptionType = new SubscriptionTypeModel({
      Name: name,
      Value,
      CreatedBy: loggedInId,
      UpdatedBy: loggedInId
    });

    await newSubscriptionType.save();
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 201,
      message: "Subscription Type  created successfully",
      data: newSubscriptionType,
  });
    // res.status(201).json(newSubscriptionType);
  } catch (error) {
    handleError(req,res, error);
  }
};

export const deleteSubscriptionType = async (req: Request, res: Response) => {
  try {
    const subscriptionType = await SubscriptionTypeModel.findByIdAndDelete(req.params.id);
    if (!subscriptionType) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Subscription Type not found",
    });
      // return res.status(404).json({ error: 'Subscription Type not found' });
    }
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 204,
      message: "Subscription Type deleted",
  });
    // return res.status(204).json({ message: 'Subscription Type deleted' });
  } catch (error) {
    handleError(req,res, error);
  }
};

export const editSubscriptionType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Name, Value } = req.body;
    const loggedInId = req['decodedToken']; // Get logged-in user ID

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Invalid subscription type ID format",
    });
      // return res.status(400).json({ error: 'Invalid subscription type ID format' });
    }

    // Check if the logged-in user ID is available
    if (!loggedInId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "User ID is required",
    });
      // return res.status(400).json({ error: 'User ID is required' });
    }

    // Prepare update object
    const updateData: any = { UpdatedBy: loggedInId };

    // If Name is provided, validate and include it in the update
    if (Name) {
      const name = Name.toLowerCase();
      const existing = await SubscriptionTypeModel.findOne({ Name: name, _id: { $ne: id } });
      if (existing) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Subscription Type with this name already exists",
      });
        // return res.status(400).json({ error: 'Subscription Type with this name already exists' });
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
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Subscription Type not found",
    });
      // return res.status(404).json({ error: 'Subscription Type not found' });
    }

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Subscription Type updated successfully",
      data:updatedSubscriptionType
  });
    // return res.status(200).json(updatedSubscriptionType);
  } catch (error) {
    handleError(req,res, error);
  }
};


// Frequency Type
export const getFrequencyTypes = async (req: Request, res: Response) => {
  try {
    const frequencyTypes = await FrequencyTypeModel.find();
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Frequency Type fetched successfully",
      data:frequencyTypes
  });
    // return res.status(200).json(frequencyTypes);
  } catch (error) {
    handleError(req,res, error);
  }
};


export const createFrequencyType = async (req: Request, res: Response) => {
  try {
    const { Name, Value } = req.body;
    
    if (!Name || Value === undefined) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Missing required fields",
    });
      // return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if Frequency Type with the same name exists (case-insensitive)
    const existing = await FrequencyTypeModel.findOne({ 
      Name: { $regex: new RegExp(`^${Name}$`, 'i') } 
    });

    if (existing) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Frequency Type already exists",
    });
      // return res.status(400).json({ error: 'Frequency Type already exists' });
    }

    // Create and save the new Frequency Type
    const newFrequencyType = new FrequencyTypeModel({ Name, Value });
    await newFrequencyType.save();
    
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 201,
      message: "Frequency Type created successfully",
      data: newFrequencyType
  });
    // res.status(201).json(newFrequencyType);
  } catch (error) {
    handleError(req,res, error);
  }
};



export const editFrequencyType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Name, Value } = req.body;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 400,
      message: "Invalid frequency type ID format",
  });
      // return res.status(400).json({ error: 'Invalid frequency type ID format' });
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
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Frequency Type with this name already exists",
      });
        // return res.status(400).json({ error: 'Frequency Type with this name already exists' });
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
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Frequency Type not found",
    });
      // return res.status(404).json({ error: 'Frequency Type not found' });
    }

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Frequency Type updated successfully",
      data:updatedFrequencyType
  });
    // return res.status(200).json(updatedFrequencyType);
  } catch (error) {
    handleError(req,res, error);
  }
};


export const deleteFrequencyType = async (req: Request, res: Response) => {
  try {
    const frequencyType = await FrequencyTypeModel.findByIdAndDelete(req.params.id);
    if (!frequencyType) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Frequency Type not found",
    });
      // return res.status(404).json({ error: 'Frequency Type not found' });
    }
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 204,
      message: "Frequency Type deleted",
  });
    // return res.status(204).json({ message: 'Frequency Type deleted' });
  } catch (error) {
    handleError(req,res, error);
  }
};