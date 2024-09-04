import { Request, Response } from 'express';
import { responseHandler } from '../utils/send-response';
import { CityModel, LocalityModel, RouteModel, VehicleModel, ZoneModel } from '../models/route.model';

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
// Going for route
export const createRoute = async (req: Request, res: Response) => {
    const LoggedInId = req['decodedToken'].id;

    if (!LoggedInId) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }

    try {
        const { RouteName, ZonesIncluded } = req.body;  // Expecting Zones as an array of { ZoneId, DeliverySequence }

        // Check if the route name already exists (case-insensitive)
        const existingRoute = await RouteModel.findOne({
            RouteName: { $regex: new RegExp(`^${RouteName}$`, 'i') }
        });

        if (existingRoute) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Route name already exists",
            });
        }


        // Check for duplicate DeliverySequence values
        const deliverySequences = ZonesIncluded.map(zone => zone.DeliverySequence);
        const uniqueDeliverySequences = new Set(deliverySequences);

        if (uniqueDeliverySequences.size !== deliverySequences.length) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Duplicate Delivery Sequences found in Zones",
            });
        }

        const newRoute = new RouteModel({
            RouteName,
            ZonesIncluded: ZonesIncluded,
            CreatedBy: LoggedInId,
            UpdatedBy: LoggedInId,
        });


        await newRoute.save();

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Route created successfully",
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

export const updateRoute = async (req: Request, res: Response) => {
  const { id } = req.params;
  const LoggedInId = req['decodedToken']?.id;

  if (!LoggedInId) {
      return responseHandler.out(req, res, {
          status: false,
          statusCode: 401,
          message: "Unauthorized",
      });
  }

  try {
      const { RouteName, ZonesIncluded, VehicleTagged } = req.body;  // Include VehicleTagged in the request body

      // Check if the route name already exists (case-insensitive) and is not the current route
      const existingRoute = await RouteModel.findOne({
          RouteName: { $regex: new RegExp(`^${RouteName}$`, 'i') },
          _id: { $ne: id }
      });

      if (existingRoute) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 400,
              message: "Route name already exists",
          });
      }

      // Validate that DeliverySequence is unique within the Zones array
      const sequences = ZonesIncluded.map(zone => zone.DeliverySequence);
      const hasDuplicate = sequences.length !== new Set(sequences).size;

      if (hasDuplicate) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 400,
              message: "Duplicate Delivery Sequences found in Zones",
          });
      }

      // Check for conflicting DeliverySequence values in other routes
      for (const zone of ZonesIncluded) {
          const { ZoneId, DeliverySequence } = zone;

          const conflictingRoutes = await RouteModel.find({
              'ZonesIncluded.ZoneId': ZoneId,
              'ZonesIncluded.DeliverySequence': DeliverySequence,
              _id: { $ne: id }  // Exclude the current route
          });

          if (conflictingRoutes.length > 0) {
              await RouteModel.updateMany(
                  {
                      'ZonesIncluded.ZoneId': ZoneId,
                      'ZonesIncluded.DeliverySequence': { $gte: DeliverySequence },
                      _id: { $ne: id }
                  },
                  { $inc: { 'ZonesIncluded.$.DeliverySequence': 1 } }
              );
          }
      }

      const updatedRoute = await RouteModel.findByIdAndUpdate(
          id,
          {
              RouteName,
              ZonesIncluded: ZonesIncluded,
              VehicleTagged,  // Update VehicleTagged field
              UpdatedBy: LoggedInId
          },
          { new: true }
      );

      if (!updatedRoute) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: "Route not found",
          });
      }

      return responseHandler.out(req, res, {
          status: true,
          statusCode: 200,
          message: "Route updated successfully",
          data:updatedRoute
      });
  } catch (error) {
      console.error(error);
      return responseHandler.out(req, res, {
          status: false,
          statusCode: 500,
          message: 'Internal Server Error',
          data:error.message,
      });
  }
};




export const getRouteById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const route = await RouteModel.findById(id).populate('VehicleTagged').populate('ZonesIncluded').populate('CreatedBy').populate('UpdatedBy');

        if (!route) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Route not found",
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Route retrieved successfully",
            data: route,
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

export const deleteRoute = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedRoute = await RouteModel.findByIdAndDelete(id);

        if (!deletedRoute) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Route not found",
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Route deleted successfully",
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

export const toggleRouteStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const LoggedInId = req['decodedToken'].id;
    const { Status } = req.body; // Status from the request body

    if (!LoggedInId) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }

    try {
        const route = await RouteModel.findById(id);

        if (!route) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Route not found",
            });
        }

        route.Status = Status; // Set the status from the request body
        route.UpdatedBy = LoggedInId;
        route.UpdatedAt = new Date();

        await route.save();

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Route status updated successfully",
            data: route,
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

export const getAllRoutes = async (req: Request, res: Response) => {
    try {
        // Pagination parameters
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        // Fetch routes with pagination and populate fields
        const routes = await RouteModel.find()
            .skip(skip)
            .limit(limit)
            .populate('VehicleTagged', 'VehicleName')  // Adjust field as needed
            .populate('ZonesIncluded', 'ZoneName DeliverySequence')  // Adjust fields as needed
            .populate('CreatedBy', 'FirstName LastName Email')  // Adjust fields as needed
            .populate('UpdatedBy', 'FirstName LastName Email')  // Adjust fields as needed
            .exec();

        // Get total count for pagination
        const total = await RouteModel.countDocuments().exec();
        const totalPages = Math.ceil(total / limit);

        // Determine if previous or next pages exist
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Routes retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                routes,
            }
        });
    } catch (error) {
        console.error(error);
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};


// Going for city
export const createCity = async (req: Request, res: Response) => {
    const LoggedInId = req['decodedToken'].id; // Extract LoggedInId from token

    if (!LoggedInId) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized"
        });
    }

    const { CityName, Serviceable, ZoneIncluded, RouteIncluded } = req.body;

    try {
        // Check if the city name already exists (case-insensitive)
        const existingCity = await CityModel.findOne({
            CityName: { $regex: new RegExp(`^${CityName}$`, 'i') }
        });

        if (existingCity) {
            return res.status(400).json({
                status: false,
                message: "City name already exists"
            });
        }

        const newCity = new CityModel({
            CityName,
            Serviceable,
            CreatedBy: LoggedInId,
            UpdatedBy: LoggedInId,
            ZoneIncluded,
            RouteIncluded
        });

        await newCity.save();

        return res.status(201).json({
            status: true,
            message: "City created successfully",
            data: newCity
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: error.message
        });
    }
};


export const getCity = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const city = await CityModel.findById(id)
            .populate('CreatedBy')
            .populate('UpdatedBy')
            .populate('ZoneIncluded')
            .populate('RouteIncluded');

        if (!city) {
            return res.status(404).json({
                status: false,
                message: "City not found"
            });
        }

        return res.status(200).json({
            status: true,
            data: city
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: error.message
        });
    }
};


export const updateCity = async (req: Request, res: Response) => {
    const { id } = req.params;
    const LoggedInId = req['decodedToken'].id; // Extract LoggedInId from token

    if (!LoggedInId) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized"
        });
    }

    const { CityName, Serviceable, ZoneIncluded, RouteIncluded } = req.body;

    try {
        // Check if the city name already exists (case-insensitive) and is not the current city
        const existingCity = await CityModel.findOne({
            CityName: { $regex: new RegExp(`^${CityName}$`, 'i') },
            _id: { $ne: id }
        });

        if (existingCity) {
            return res.status(400).json({
                status: false,
                message: "City name already exists"
            });
        }

        const updatedCity = await CityModel.findByIdAndUpdate(
            id,
            {
                CityName,
                Serviceable,
                UpdatedBy: LoggedInId,
                UpdatedAt: new Date(),
                ZoneIncluded,
                RouteIncluded
            },
            { new: true }
        )

        if (!updatedCity) {
            return res.status(404).json({
                status: false,
                message: "City not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "City updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: error.message
        });
    }
};
export const deleteCity = async (req: Request, res: Response) => {
    const { id } = req.params;
    const LoggedInId = req['decodedToken'].id; // Extract LoggedInId from token

    if (!LoggedInId) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized"
        });
    }

    try {
        const city = await CityModel.findByIdAndDelete(id);

        if (!city) {
            return res.status(404).json({
                status: false,
                message: "City not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "City deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: error.message
        });
    }
};

export const getAllCity = async (req: Request, res: Response) => {

    try {
        const city = await CityModel.find()
            .populate('CreatedBy')
            .populate('UpdatedBy')
            .populate('ZoneIncluded')
            .populate('RouteIncluded');

        if (!city) {
            return res.status(404).json({
                status: false,
                message: "City not found"
            });
        }

        return res.status(200).json({
            status: true,
            data: city
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: error.message
        });
    }
};

export const updateServiceableStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Serviceable } = req.body;  // Expecting a boolean value

    // Validate that the Serviceable field is a boolean
    if (typeof Serviceable !== 'boolean') {
        return res.status(400).json({
            status: false,
            message: "Serviceable status must be a boolean value"
        });
    }

    try {
        // Update the city document with the new Serviceable status
        const updatedCity = await CityModel.findByIdAndUpdate(
            id,
            { Serviceable },
            { new: true }
        );

        if (!updatedCity) {
            return res.status(404).json({
                status: false,
                message: "City not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Serviceable status updated successfully",
            data: updatedCity
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: error.message
        });
    }
};