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
      const existingVehicleName = req.body.VehicleName.trim(); // Trim whitespace from input

      const existingVehicle = await VehicleModel.findOne({
        VehicleName: { $regex: new RegExp(`^${existingVehicleName}$`, 'i') }
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
    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (currentPage - 1) * limit;
    const vehicles = await VehicleModel.find()
    .skip(skip)
    .limit(limit)
      .populate('CreatedBy', 'First Name LastName PhoneNumber')
      .populate('UpdatedBy', 'First Name LastName PhoneNumber')
      .exec();

      const total = await VehicleModel.countDocuments();
      const totalPages = Math.ceil(total / limit);

      const prevPage = currentPage > 1;
      const nextPage = currentPage < totalPages;


    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Vehicles fetched successfully",
      data: {
        total,
        currentPage,
        totalPages,
        prevPage,
        nextPage,
        vehicles,
    }
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

//   Going for Locality 

export const createLocality = async (req: Request, res: Response) => {
  const LoggedInId = req['decodedToken'].id;
  const localityName = req.body.LocalityName.trim(); // Trim the input
  const pin = req.body.Pin;

  if (!LoggedInId) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 401,
      message: "Unauthorized",
    });
  }


  try {
    // Check if a locality with the same name and pin exists globally (case insensitive)
    const existingLocality = await LocalityModel.findOne({
      $or: [
        { LocalityName: { $regex: new RegExp(`^${localityName}$`, 'i') } },
        { Pin: pin },
      ],
    });
    
    // If a match is found, return an error
    if (existingLocality) {
      return res.status(400).json({ error: 'Locality name or pin already exists.' });
    }

    if (existingLocality) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 403,
        message: "Locality with the same name & Pin already exists globally",
      });
    }

    // Create the new locality
    const newLocality = new LocalityModel({
      ...req.body,
      CreatedBy: LoggedInId,
      UpdatedBy: LoggedInId,
    });

    await newLocality.save();

    // Find the Zone by the Zone ID
    const zone = await ZoneModel.findById(req.body.Zone);

    if (!zone) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: "Zone not found",
      });
    }

    // Check if the locality already exists in the zone's Localities array
    const localityExistsInZone = zone.Localities.some(
      (localityId) => localityId.toString() === newLocality._id.toString()
    );

    if (localityExistsInZone) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 403,
        message: "Locality already exists in the specified Zone",
      });
    }

    // Push the new locality's reference into the Localities array of the zone
    zone.Localities.push(newLocality._id);

    // Save the updated Zone
  const newZone=  await zone.save();
  console.log(newZone)

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 201,
      message: "Locality created successfully and added to Zone",
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
                localitys: localities,
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
        data:updatedLocality,
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
      const { ZoneName, City,Serviceable,DeliveryCost } = req.body;
  
      // Check if a zone with the same name exists (case insensitive)
      const trimmedZoneName = ZoneName.trim();
      const existingZone = await ZoneModel.findOne({
        ZoneName: { $regex: new RegExp(`^${trimmedZoneName}$`, 'i') },
      });
  
      if (existingZone) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 403,
          message: "Zone with the same name already exists",
        });
      }
  
      // Check if the city exists
      const city = await CityModel.findById(City);
      if (!city) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 404,
          message: "City not found",
        });
      }
  
      // Check if the zone is already included in the city
      const zoneExistsInCity = city?.ZoneIncluded?.some(
        (zoneId) => zoneId.toString() === existingZone?._id.toString()
      );
  
      if (zoneExistsInCity) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: "Zone already included in the City",
        });
      }
  
      // Create new zone
      const newZone = new ZoneModel({
        ZoneName: trimmedZoneName,
        CreatedBy: LoggedInId,
        UpdatedBy: LoggedInId,
        Serviceable: Serviceable,
        DeliveryCost:DeliveryCost
      });
  
      await newZone.save();
  
      // Add the zone to the city's ZoneIncluded field
      await CityModel.findByIdAndUpdate(
        City,
        { $addToSet: { ZoneIncluded: newZone._id } }, // Add only if the ID is not already present
        { new: true }
      );
  
      return responseHandler.out(req, res, {
        status: true,
        statusCode: 201,
        message: "Zone created successfully and added to the City",
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

      // Fetch all zones with pagination and populate relevant fields
     const zones = await ZoneModel.find({}, '-Localities')  // Exclude Localities field
  .skip(skip)  // Apply pagination
  .limit(limit)  // Set limit for pagination
  .populate('CreatedBy', 'Email')  // Populate CreatedBy with Email
  .populate('UpdatedBy', 'Email')  // Populate UpdatedBy with Email
  .exec();


      // Get all city names that include the zones found
      const cityIds = zones.map(zone => zone._id);
      const cities = await CityModel.find({ ZoneIncluded: { $in: cityIds } })
          .select('CityName ZoneIncluded')
          .exec();

// Map the cities to create a lookup for zone IDs
const cityMap = cities.reduce((acc, city) => {
  city.ZoneIncluded.forEach(zoneId => {
      acc[zoneId.toString()] = city.CityName; // Convert ObjectId to string for mapping
  });
  return acc;
}, {} as Record<string, string>);

// Attach city names to the zones
const zonesWithCityNames = zones.map(zone => ({
  ...zone.toObject(),
  CityName: cityMap[zone._id.toString()] || null, // Convert ObjectId to string for lookup
}));


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
              zones: zonesWithCityNames,
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
      // Fetch the zone details, excluding the 'Localities' field
      const zone = await ZoneModel.findById(id)
          .populate('CreatedBy', 'FirstName LastName PhoneNumber')
          .populate('UpdatedBy', 'FirstName LastName PhoneNumber')
          .select('-Localities')
          .exec();

      // If no zone is found, return a 404 response
      if (!zone) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: "Zone not found",
          });
      }

      // Fetch the city that includes this zone
      const city = await CityModel.findOne({ ZoneIncluded: { $in: id } })
      .select('CityName _id')  // Only return CityName and _id fields        
      // .populate('-CreatedBy')
      // .populate('-UpdatedBy')
      // .populate('-ZoneIncluded')
      // .populate('-RouteIncluded')

      .exec();
  

      // If no city is found, return a 404 response
      if (!city) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: "City not found for this zone",
          });
      }

      // Return both the zone and the city
      return responseHandler.out(req, res, {
          status: true,
          statusCode: 200,
          message: "Zone and city fetched successfully",
          data: { zone, city },
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
    console.log(req.body)
    const LoggedInId = req['decodedToken'].id;

    if (!LoggedInId) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }

    try {
        const { ZoneName ,City} = req.body;

        const trimmedZoneName = ZoneName.trim(); // Trim leading and trailing spaces

        // Check if a zone with the same name exists (case insensitive) but not the current zone
        const existingZoneByName = await ZoneModel.findOne({
            ZoneName: { $regex: new RegExp(`^${trimmedZoneName}$`, 'i') },
            _id: { $ne: id }
        });
        
        if (existingZoneByName) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Zone with the same name already exists",
            });
        }

        let isCityExist=   await CityModel.findById({_id:City})

        if(!isCityExist){
           return responseHandler.out(req, res, {
               status: false,
               statusCode: 404,
               message: "City not found",
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

        // await CityModel.findByIdAndUpdate(
        //   City,
        //   { $addToSet: { ZoneIncluded: newZone._id } }, // Add only if the ID is not already present
        //   { new: true }
        // );

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Zone updated successfully",
            data:updatedZone
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
            message: "Zone updated successfully",
            data:updatedZone
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
        const { RouteName, ZonesIncluded,Days,VehicleTagged } = req.body;  // Expecting Zones as an array of { ZoneId, DeliverySequence }

        // Check if the route name already exists (case-insensitive)
        const existingRoute = await RouteModel.findOne({
          RouteName: { 
              $regex: new RegExp(`^${RouteName.trim()}$`, 'i') // Trim and use case-insensitive regex
          }
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
            Days:Days,
            VehicleTagged
        });

        console.log(newRoute)

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
            .populate('VehicleTagged')  // Adjust field as needed
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
  const LoggedInId = req['decodedToken']?.id;

  if (!LoggedInId) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 401,
      message: "Unauthorized"
    });
  }

  let { CityName, Serviceable, SortOrder } = req.body;

  // Trim the CityName if it exists
  CityName = CityName?.trim();

  try {
    // Check if the city name already exists (case-insensitive)
    const existingCity = await CityModel.findOne({
      CityName: { $regex: new RegExp(`^${CityName}$`, 'i') }
    });

    if (existingCity) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 403,
        message: "City name already exists"
      });
    }

    // Check if the sort order already exists
    if (SortOrder !== undefined) {
      const existingSortOrder = await CityModel.findOne({ SortOrder });

      if (existingSortOrder) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 403,
          message: "Sort order already exists"
        });
      }
    }

    const newCity = new CityModel({
      CityName,
      Serviceable,
      CreatedBy: LoggedInId,
      UpdatedBy: LoggedInId,
      SortOrder // Include SortOrder if it's part of the model
    });

    await newCity.save();

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 201,
      message: "City created successfully",
      data:newCity
    });
  } catch (error) {
    console.error('Error creating city:', error); // Log error for debugging

    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal Server Error',
      data:error.message
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
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized"
        });
    }

    const { CityName, Serviceable } = req.body;

    try {
        // Check if the city name already exists (case-insensitive) and is not the current city
        const existingCity = await CityModel.findOne({
            CityName: { $regex: new RegExp(`^${CityName}$`, 'i') },
            _id: { $ne: id }
        });

        if (existingCity) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
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
            },
            { new: true }
        );

        if (!updatedCity) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "City not found"
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "City updated successfully",
            data: updatedCity
        });
    } catch (error: any) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: "Internal Server Error",
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
    const currentPage = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (currentPage - 1) * limit;

    const city = await CityModel.aggregate([
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'CreatedBy',
          foreignField: '_id',
          as: 'CreatedBy'
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'UpdatedBy',
          foreignField: '_id',
          as: 'UpdatedBy'
        }
      },
      {
        $unwind: {
          path: '$CreatedBy',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$UpdatedBy',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          // Explicitly include all the fields you want
          CityName: 1,
          Serviceable: 1,   // Example city field
          SortOrder: 1,   // Example city field
          CreatedAt: 1,    // Example city field
          UpdatedAt: 1,    // Example city field
          CreatedBy: {
            FirstName: 1,
            LastName: 1,
            PhoneNumber: 1
          },
          UpdatedBy: {
            FirstName: 1,
            LastName: 1,
            PhoneNumber: 1
          },
          // Calculate counts for ZoneIncluded and RouteIncluded
          ZoneIncludedCount: { $size: { $ifNull: ['$ZoneIncluded', []] } },
          RouteIncludedCount: { $size: { $ifNull: ['$RouteIncluded', []] } }
          // Do not include ZoneIncluded and RouteIncluded by simply not mentioning them here
        }
      }
    ]);

    if (!city || city.length === 0) {
      return res.status(404).json({
        status: false,
        message: "City not found"
      });
    }

    const total = await CityModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const prevPage = currentPage > 1;
    const nextPage = currentPage < totalPages;

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: "Cities retrieved successfully",
      data: {
        total,
        currentPage,
        totalPages,
        prevPage,
        nextPage,
        citys:city
      }
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


export const filterCities = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const pipeline: any[] = [];

    // Ensure query parameters are correctly passed
    if (filters.CityName) {
      pipeline.push({
        $match: {
          CityName: { $regex: new RegExp(filters.CityName as string, 'i') },
        },
      });
    }

    if (filters.SortOrder) {
      const sortOrder = parseInt(filters.SortOrder as string);
      if (!isNaN(sortOrder)) {
        pipeline.push({
          $match: {
            SortOrder: sortOrder,
          },
        });
      } else {
        return res.status(400).json({
          status: false,
          message: 'Invalid SortOrder value',
        });
      }
    }

    // Exclude the 'ZoneIncluded' and 'RouteIncluded' fields
    pipeline.push({
      $project: {
        ZoneIncluded: 0, // Excludes ZoneIncluded field
        RouteIncluded: 0, // Optionally exclude RouteIncluded field as well
      },
    });

    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || await CityModel.countDocuments().exec();
    const skip = (currentPage - 1) * limit;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const cities = await CityModel.aggregate(pipeline);

    const total = await CityModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message: 'Cities retrieved successfully',
      data: {
        total,
        currentPage,
        totalPages,
        cities,
      },
    });
  } catch (error) {
    console.error("Error in filterCities:", error);
    res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: error.message,
    });
  }
};

export const searchZonesInCreation = async (req: Request, res: Response) => {
  try {
      const { CityId, ZoneName, page, limit } = req.query;

      // Check if cityId is provided
      if (!CityId) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 400,
              message: 'City ID is required',
          });
      }

      // Find city and populate zones
      const city = await CityModel.findById(CityId).populate('ZoneIncluded');

      // Check if city exists
      if (!city) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: 'City not found',
          });
      }

      const zonesFromCity = city.ZoneIncluded?.map((zone: any) => zone._id) || [];

      const pipeline: any[] = [
          { $match: { _id: { $in: zonesFromCity } } }  // Match only zones included in the city
      ];

      // Apply ZoneName filter if provided
      if (ZoneName) {
          pipeline.push({
              $match: {
                  ZoneName: { $regex: new RegExp(ZoneName as string, 'i') },
              },
          });
      }

      const currentPage = parseInt(page as string) || 1;
      const limitValue = parseInt(limit as string) || await ZoneModel.countDocuments().exec();
      const skip = (currentPage - 1) * limitValue;

      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limitValue });

      const zones = await ZoneModel.aggregate(pipeline);

      const total = await ZoneModel.countDocuments({ _id: { $in: zonesFromCity } });
      const totalPages = Math.ceil(total / limitValue);

      // Respond with the result using responseHandler.out
      return responseHandler.out(req, res, {
          status: true,
          statusCode: 200,
          message: 'Zones retrieved successfully',
          data: {
              total,
              currentPage,
              totalPages,
              zones,
          },
      });
  } catch (error) {
      console.error("Error in searchZones:", error);
      // Use responseHandler.out to send the error
      return responseHandler.out(req, res, {
          status: false,
          statusCode: 500,
          message: 'Internal Server Error',
          data: error.message,
      });
  }
};


export const filterVehicle = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const pipeline: any[] = [];

    console.log(filters.VehicleName)
    // Ensure query parameters are correctly passed
    if (filters.VehicleName) {
      pipeline.push({
        $match: {
          VehicleName: { $regex: new RegExp(filters.VehicleName as string, 'i') },
          Status:true,
        },
      });
    }
    if (filters.Classification) {
      pipeline.push({
        $match: {
          Classification: { $regex: new RegExp(filters.Classification as string, 'i') },
          Status:true,
        },
      });
    }

    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || await VehicleModel.countDocuments().exec();
    const skip = (currentPage - 1) * limit;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const vehicles = await VehicleModel.aggregate(pipeline);

    const total = await VehicleModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message: 'Vehicle retrieved successfully',
      data: {
        total,
        currentPage,
        totalPages,
        vehicles,
      },
    });
  } catch (error) {
    console.error("Error in filterCities:", error);
    res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: error.message,
    });
  }
};

export const filterZone = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const pipeline: any[] = [];
    // Ensure query parameters are correctly passed
    if (filters.ZoneName) {
      pipeline.push({
        $match: {
          ZoneName: { $regex: new RegExp(filters.ZoneName as string, 'i') },
          Serviceable:true,
        },
      });
    }
 
    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || await VehicleModel.countDocuments().exec();
    const skip = (currentPage - 1) * limit;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const zones = await ZoneModel.aggregate(pipeline);

    const total = await ZoneModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: true,
      message: 'Zone retrieved successfully',
      data: {
        total,
        currentPage,
        totalPages,
        zones,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: error.message,
    });
  }
};