import { Request, Response } from 'express';
import { responseHandler } from '../utils/send-response';
import { LocalityModel, VehicleModel, ZoneModel } from '../models/route.model';

// Create a new Vehicle
export const createVehicle = async (req: Request, res: Response) => {
    const LoggedInId = req['decodedToken'].id;
  
    if (!LoggedInId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 401,
        message: "Unauthorized",
      });
    }
  
    try {
      // Check if a vehicle with the same name exists (case insensitive)
      const existingVehicle = await VehicleModel.findOne({
        VehicleName: { $regex: new RegExp(`^${req.body.VehicleName}$`, 'i') }
      });
  
      if (existingVehicle) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Vehicle with the same name already exists",
        });
      }
  
      const newVehicle = new VehicleModel({
        ...req.body,
        CreatedBy: LoggedInId,
        UpdatedBy: LoggedInId,
      });
  
      await newVehicle.save();
  
      return responseHandler.out(req, res, {
        status: true,
        statusCode: 201,
        message: "Vehicle created successfully",
      });
    } catch (error) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: error.message,
      });
    }
  };
  

// Get all Vehicles
export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await VehicleModel.find()
      .populate('CreatedBy', 'name')
      .populate('UpdatedBy', 'name')
      .exec();

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Vehicles fetched successfully",
      data: vehicles,
    });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal Server Error',
      data: error.message,
    });
  }
};

// Get Vehicle by ID
export const getVehicleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const vehicle = await VehicleModel.findById(id)
      .populate('CreatedBy', 'FirstName LastName PhoneNumber')
      .populate('UpdatedBy', 'FirstName LastName PhoneNumber')
      .exec();

    if (!vehicle) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Vehicle not found",
      });
    }

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Vehicle fetched successfully",
      data: vehicle,
    });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal Server Error',
      data: error.message,
    });
  }
};

// Update Vehicle
export const updateVehicle = async (req: Request, res: Response) => {
    const { id } = req.params;
    const superAdminId = req['decodedToken'].id;
  
    if (!superAdminId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 401,
        message: "Unauthorized",
      });
    }
  
    try {
      // Check if a vehicle with the same name exists (case insensitive)
      const existingVehicle = await VehicleModel.findOne({
        _id: { $ne: id },  // Exclude the current vehicle
        VehicleName: { $regex: new RegExp(`^${req.body.VehicleName}$`, 'i') }
      });
  
      if (existingVehicle) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Vehicle with the same name already exists",
        });
      }
  
      const updatedVehicle = await VehicleModel.findByIdAndUpdate(
        id,
        {
          ...req.body,
          UpdatedBy: superAdminId,
          UpdatedAt: new Date(),
        },
        { new: true }
      );
  
      if (!updatedVehicle) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 404,
          message: "Vehicle not found",
        });
      }
  
      return responseHandler.out(req, res, {
        status: true,
        statusCode: 200,
        message: "Vehicle updated successfully",
        data: updatedVehicle,
      });
    } catch (error) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: error.message,
      });
    }
  };
  

// Delete Vehicle
export const deleteVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedVehicle = await VehicleModel.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Vehicle not found",
      });
    }

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal Server Error',
      data: error.message,
    });
  }
};


// Update only the Status of a Vehicle
export const updateVehicleStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Status } = req.body;
    const superAdminId = req['decodedToken'].id;
    if (!superAdminId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 401,
        message: "Unauthorized",
      });
    }
  
    if (typeof Status !== 'boolean') {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Invalid Status value",
      });
    }
  
    try {
      // Find the vehicle and update only the Status field
      const updatedVehicle = await VehicleModel.findByIdAndUpdate(
        id,
        {
          Status,
          UpdatedBy: superAdminId,
          UpdatedAt: new Date(),
        },
        { new: true }
      );

      console.log(updatedVehicle)
  
      if (!updatedVehicle) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 404,
          message: "Vehicle not found",
        });
      }
  
      return responseHandler.out(req, res, {
        status: true,
        statusCode: 200,
        message: "Vehicle status updated successfully",
      });
    } catch (error) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: error.message,
      });
    }
  };

//   Going for Locality 

export const createLocality = async (req: Request, res: Response) => {
    const LoggedInId = req['decodedToken'].id;
  
    if (!LoggedInId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 401,
        message: "Unauthorized",
      });
    }
  
    try {
      // Check if a locality with the same name exists (case insensitive)
      const existingLocality = await LocalityModel.findOne({
        LocalityName: { $regex: new RegExp(`^${req.body.LocalityName}$`, 'i') }
      });
  
      if (existingLocality) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Locality with the same name already exists",
        });
      }
  
      const newLocality = new LocalityModel({
        ...req.body,
        CreatedBy: LoggedInId,
        UpdatedBy: LoggedInId,
      });
  
      await newLocality.save();
  
      return responseHandler.out(req, res, {
        status: true,
        statusCode: 201,
        message: "Locality created successfully",
      });
    } catch (error) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: error.message,
      });
    }
  };
  // Get all Localities
  export const getAllLocalities = async (req: Request, res: Response) => {
    try {
        // Parse pagination parameters
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        // Fetch localities with pagination and population
        const localities = await LocalityModel.find()
            .skip(skip)
            .limit(limit)
            .populate('CreatedBy', 'Email')  // Populate CreatedBy with Email
            .populate('UpdatedBy', 'Email')  // Populate UpdatedBy with Email
            .exec();

        // Count total number of localities
        const total = await LocalityModel.countDocuments().exec();
        const totalPages = Math.ceil(total / limit);

        // Determine pagination status
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        // Respond with the paginated localities and metadata
        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Localities retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                localities,
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

  // Get Locality by ID
export const getLocalityById = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const locality = await LocalityModel.findById(id)
        .populate('CreatedBy', 'FirstName LastName PhoneNumber')
        .populate('UpdatedBy', 'FirstName LastName PhoneNumber')
        .exec();
  
      if (!locality) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 404,
          message: "Locality not found",
        });
      }
  
      return responseHandler.out(req, res, {
        status: true,
        statusCode: 200,
        message: "Locality fetched successfully",
        data: locality,
      });
    } catch (error) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: error.message,
      });
    }
  };

  // Update Locality
export const updateLocality = async (req: Request, res: Response) => {
    const { id } = req.params;
    const superAdminId = req['decodedToken'].id;
  
    if (!superAdminId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 401,
        message: "Unauthorized",
      });
    }
  
    try {
      // Check if a locality with the same name exists (case insensitive)
      const existingLocality = await LocalityModel.findOne({
        _id: { $ne: id },  // Exclude the current locality
        LocalityName: { $regex: new RegExp(`^${req.body.LocalityName}$`, 'i') }
      });
  
      if (existingLocality) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Locality with the same name already exists",
        });
      }
  
      const updatedLocality = await LocalityModel.findByIdAndUpdate(
        id,
        {
          ...req.body,
          UpdatedBy: superAdminId,
          UpdatedAt: new Date(),
        },
        { new: true }
      );
  
      if (!updatedLocality) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 404,
          message: "Locality not found",
        });
      }
  
      return responseHandler.out(req, res, {
        status: true,
        statusCode: 200,
        message: "Locality updated successfully"
      });
    } catch (error) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: error.message,
      });
    }
  };

  // Delete Locality
export const deleteLocality = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const deletedLocality = await LocalityModel.findByIdAndDelete(id);
  
      if (!deletedLocality) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 404,
          message: "Locality not found",
        });
      }
  
      return responseHandler.out(req, res, {
        status: true,
        statusCode: 200,
        message: "Locality deleted successfully",
      });
    } catch (error) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: error.message,
      });
    }
  };

  // Update only the Serviceable field of a Locality
export const updateLocalityServiceable = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Serviceable } = req.body;
    const superAdminId = req['decodedToken'].id;
  
    if (!superAdminId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 401,
        message: "Unauthorized",
      });
    }
  
    if (typeof Serviceable !== 'boolean') {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: "Invalid Serviceable value",
      });
    }
  
    try {
      // Find the locality and update only the Serviceable field
      const updatedLocality = await LocalityModel.findByIdAndUpdate(
        id,
        {
          Serviceable,
          UpdatedBy: superAdminId,
          UpdatedAt: new Date(),
        },
        { new: true }
      );
  
      if (!updatedLocality) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 404,
          message: "Locality not found",
        });
      }
  
      return responseHandler.out(req, res, {
        status: true,
        statusCode: 200,
        message: "Locality serviceable status updated successfully",
      });
    } catch (error) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: error.message,
      });
    }
  };
  

  // going for zone 

  export const createZone = async (req: Request, res: Response) => {
    const LoggedInId = req['decodedToken'].id;

    if (!LoggedInId) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }

    try {
        const { ZoneName } = req.body;

        // Check if a zone with the same name exists (case insensitive)
        const existingZone = await ZoneModel.findOne({
            ZoneName: { $regex: new RegExp(`^${ZoneName}$`, 'i') }
        });

        if (existingZone) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Zone with the same name already exists",
            });
        }

        const newZone = new ZoneModel({
            ...req.body,
            CreatedBy: LoggedInId,
            UpdatedBy: LoggedInId,
        });

        await newZone.save();

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Zone created successfully",
        });
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
};



export const getAllZones = async (req: Request, res: Response) => {
    try {
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        const zones = await ZoneModel.find()
            .skip(skip)
            .limit(limit)
            .populate('CreatedBy', 'Email')  // Populate CreatedBy with Email
            .populate('UpdatedBy', 'Email')  // Populate UpdatedBy with Email
            .populate('Localities', 'LocalityName')  // Populate Localities with LocalityName
            .exec();

        const total = await ZoneModel.countDocuments().exec();
        const totalPages = Math.ceil(total / limit);

        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Zones retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                zones,
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

export const getZoneById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const zone = await ZoneModel.findById(id)
            .populate('CreatedBy', 'FirstName LastName PhoneNumber')
            .populate('UpdatedBy', 'FirstName LastName PhoneNumber')
            .populate('Localities', 'LocalityName')
            .exec();

        if (!zone) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Zone not found",
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Zone fetched successfully",
            data: zone,
        });
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
};


export const updateZone = async (req: Request, res: Response) => {
    const { id } = req.params;
    const LoggedInId = req['decodedToken'].id;

    if (!LoggedInId) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }

    try {
        const { ZoneName } = req.body;

        // Check if a zone with the same name exists (case insensitive) but not the current zone
        const existingZoneByName = await ZoneModel.findOne({
            ZoneName: { $regex: new RegExp(`^${ZoneName}$`, 'i') },
            _id: { $ne: id }
        });

        if (existingZoneByName) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Zone with the same name already exists",
            });
        }

        const updatedZone = await ZoneModel.findByIdAndUpdate(
            id,
            {
                ...req.body,
                UpdatedBy: LoggedInId,
                UpdatedAt: new Date(),
            },
            { new: true }
        );

        if (!updatedZone) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Zone not found",
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Zone updated successfully",
        });
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
};




export const deleteZone = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedZone = await ZoneModel.findByIdAndDelete(id);

        if (!deletedZone) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Zone not found",
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Zone deleted successfully",
        });
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
};


export const updateZoneServiceable = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Serviceable } = req.body;
    const superAdminId = req['decodedToken'].id;

    if (!superAdminId) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }

    if (typeof Serviceable !== 'boolean') {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: "Invalid Serviceable value",
        });
    }

    try {
        const updatedZone = await ZoneModel.findByIdAndUpdate(
            id,
            {
                Serviceable,
                UpdatedBy: superAdminId,
                UpdatedAt: new Date(),
            },
            { new: true }
        );

        if (!updatedZone) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Zone not found",
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Zone updated successfully"
        });
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
};
