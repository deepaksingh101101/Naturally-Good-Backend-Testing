"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterCities = exports.updateServiceableStatus = exports.getAllCity = exports.deleteCity = exports.updateCity = exports.getCity = exports.createCity = exports.getAllRoutes = exports.toggleRouteStatus = exports.deleteRoute = exports.getRouteById = exports.updateRoute = exports.createRoute = exports.updateZoneServiceable = exports.deleteZone = exports.updateZone = exports.getZoneById = exports.getAllZones = exports.createZone = exports.updateLocalityServiceable = exports.deleteLocality = exports.updateLocality = exports.getLocalityById = exports.getAllLocalities = exports.createLocality = exports.updateVehicleStatus = exports.deleteVehicle = exports.updateVehicle = exports.getVehicleById = exports.getAllVehicles = exports.createVehicle = void 0;
const send_response_1 = require("../utils/send-response");
const route_model_1 = require("../models/route.model");
// Create a new Vehicle
const createVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const LoggedInId = req['decodedToken'].id;
    if (!LoggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    try {
        // Check if a vehicle with the same name exists (case insensitive)
        const existingVehicleName = req.body.VehicleName.trim(); // Trim whitespace from input
        const existingVehicle = yield route_model_1.VehicleModel.findOne({
            VehicleName: { $regex: new RegExp(`^${existingVehicleName}$`, 'i') }
        });
        if (existingVehicle) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Vehicle with the same name already exists",
            });
        }
        const newVehicle = new route_model_1.VehicleModel(Object.assign(Object.assign({}, req.body), { CreatedBy: LoggedInId, UpdatedBy: LoggedInId }));
        yield newVehicle.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Vehicle created successfully",
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.createVehicle = createVehicle;
// Get all Vehicles
const getAllVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        const vehicles = yield route_model_1.VehicleModel.find()
            .skip(skip)
            .limit(limit)
            .populate('CreatedBy', 'First Name LastName PhoneNumber')
            .populate('UpdatedBy', 'First Name LastName PhoneNumber')
            .exec();
        const total = yield route_model_1.VehicleModel.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        return send_response_1.responseHandler.out(req, res, {
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
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.getAllVehicles = getAllVehicles;
// Get Vehicle by ID
const getVehicleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const vehicle = yield route_model_1.VehicleModel.findById(id)
            .populate('CreatedBy', 'FirstName LastName PhoneNumber')
            .populate('UpdatedBy', 'FirstName LastName PhoneNumber')
            .exec();
        if (!vehicle) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Vehicle not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Vehicle fetched successfully",
            data: vehicle,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.getVehicleById = getVehicleById;
// Update Vehicle
const updateVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const superAdminId = req['decodedToken'].id;
    if (!superAdminId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    try {
        // Check if a vehicle with the same name exists (case insensitive)
        const existingVehicle = yield route_model_1.VehicleModel.findOne({
            _id: { $ne: id }, // Exclude the current vehicle
            VehicleName: { $regex: new RegExp(`^${req.body.VehicleName}$`, 'i') }
        });
        if (existingVehicle) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Vehicle with the same name already exists",
            });
        }
        const updatedVehicle = yield route_model_1.VehicleModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { UpdatedBy: superAdminId, UpdatedAt: new Date() }), { new: true });
        if (!updatedVehicle) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Vehicle not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Vehicle updated successfully",
            data: updatedVehicle,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.updateVehicle = updateVehicle;
// Delete Vehicle
const deleteVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedVehicle = yield route_model_1.VehicleModel.findByIdAndDelete(id);
        if (!deletedVehicle) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Vehicle not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Vehicle deleted successfully",
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.deleteVehicle = deleteVehicle;
// Update only the Status of a Vehicle
const updateVehicleStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { Status } = req.body;
    const superAdminId = req['decodedToken'].id;
    if (!superAdminId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    if (typeof Status !== 'boolean') {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: "Invalid Status value",
        });
    }
    try {
        // Find the vehicle and update only the Status field
        const updatedVehicle = yield route_model_1.VehicleModel.findByIdAndUpdate(id, {
            Status,
            UpdatedBy: superAdminId,
            UpdatedAt: new Date(),
        }, { new: true });
        if (!updatedVehicle) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Vehicle not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Vehicle status updated successfully",
            data: updatedVehicle,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.updateVehicleStatus = updateVehicleStatus;
//   Going for Locality 
const createLocality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const LoggedInId = req['decodedToken'].id;
    if (!LoggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    try {
        // Check if a locality with the same name exists (case insensitive)
        const localityName = req.body.LocalityName.trim(); // Trim the input
        const existingLocality = yield route_model_1.LocalityModel.findOne({
            LocalityName: { $regex: new RegExp(`^${localityName}$`, 'i') }
        });
        if (existingLocality) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Locality with the same name already exists",
            });
        }
        const newLocality = new route_model_1.LocalityModel(Object.assign(Object.assign({}, req.body), { CreatedBy: LoggedInId, UpdatedBy: LoggedInId }));
        yield newLocality.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Locality created successfully",
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.createLocality = createLocality;
// Get all Localities
const getAllLocalities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse pagination parameters
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        // Fetch localities with pagination and population
        const localities = yield route_model_1.LocalityModel.find()
            .skip(skip)
            .limit(limit)
            .populate('CreatedBy', 'Email') // Populate CreatedBy with Email
            .populate('UpdatedBy', 'Email') // Populate UpdatedBy with Email
            .exec();
        // Count total number of localities
        const total = yield route_model_1.LocalityModel.countDocuments().exec();
        const totalPages = Math.ceil(total / limit);
        // Determine pagination status
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        // Respond with the paginated localities and metadata
        send_response_1.responseHandler.out(req, res, {
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
    }
    catch (error) {
        console.error(error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
});
exports.getAllLocalities = getAllLocalities;
// Get Locality by ID
const getLocalityById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const locality = yield route_model_1.LocalityModel.findById(id)
            .populate('CreatedBy', 'FirstName LastName PhoneNumber')
            .populate('UpdatedBy', 'FirstName LastName PhoneNumber')
            .exec();
        if (!locality) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Locality not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Locality fetched successfully",
            data: locality,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.getLocalityById = getLocalityById;
// Update Locality
const updateLocality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const superAdminId = req['decodedToken'].id;
    if (!superAdminId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    try {
        // Check if a locality with the same name exists (case insensitive)
        const existingLocality = yield route_model_1.LocalityModel.findOne({
            _id: { $ne: id }, // Exclude the current locality
            LocalityName: { $regex: new RegExp(`^${req.body.LocalityName}$`, 'i') }
        });
        if (existingLocality) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Locality with the same name already exists",
            });
        }
        const updatedLocality = yield route_model_1.LocalityModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { UpdatedBy: superAdminId, UpdatedAt: new Date() }), { new: true });
        if (!updatedLocality) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Locality not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Locality updated successfully"
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.updateLocality = updateLocality;
// Delete Locality
const deleteLocality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedLocality = yield route_model_1.LocalityModel.findByIdAndDelete(id);
        if (!deletedLocality) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Locality not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Locality deleted successfully",
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.deleteLocality = deleteLocality;
// Update only the Serviceable field of a Locality
const updateLocalityServiceable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { Serviceable } = req.body;
    const superAdminId = req['decodedToken'].id;
    if (!superAdminId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    if (typeof Serviceable !== 'boolean') {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: "Invalid Serviceable value",
        });
    }
    try {
        // Find the locality and update only the Serviceable field
        const updatedLocality = yield route_model_1.LocalityModel.findByIdAndUpdate(id, {
            Serviceable,
            UpdatedBy: superAdminId,
            UpdatedAt: new Date(),
        }, { new: true });
        if (!updatedLocality) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Locality not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Locality serviceable status updated successfully",
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.updateLocalityServiceable = updateLocalityServiceable;
// going for zone 
const createZone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const LoggedInId = req['decodedToken'].id;
    if (!LoggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    try {
        const { ZoneName, City } = req.body;
        // Check if a zone with the same name exists (case insensitive)
        const trimmedZoneName = ZoneName.trim();
        const existingZone = yield route_model_1.ZoneModel.findOne({
            ZoneName: { $regex: new RegExp(`^${trimmedZoneName}$`, 'i') }
        });
        if (existingZone) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 403,
                message: "Zone with the same name already exists",
            });
        }
        let isCityExist = yield route_model_1.CityModel.findById({ _id: City });
        if (!isCityExist) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "City not found",
            });
        }
        const newZone = new route_model_1.ZoneModel(Object.assign(Object.assign({}, req.body), { CreatedBy: LoggedInId, UpdatedBy: LoggedInId }));
        yield newZone.save();
        yield route_model_1.CityModel.findByIdAndUpdate(City, { $addToSet: { ZoneIncluded: newZone._id } }, // Add only if the ID is not already present
        { new: true });
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Zone created successfully",
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.createZone = createZone;
const getAllZones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        // Fetch all zones with pagination and populate relevant fields
        const zones = yield route_model_1.ZoneModel.find()
            .skip(skip)
            .limit(limit)
            .populate('CreatedBy', 'Email') // Populate CreatedBy with Email
            .populate('UpdatedBy', 'Email') // Populate UpdatedBy with Email
            .populate('Localities', 'LocalityName') // Populate Localities with LocalityName
            .exec();
        // Get all city names that include the zones found
        const cityIds = zones.map(zone => zone._id);
        const cities = yield route_model_1.CityModel.find({ ZoneIncluded: { $in: cityIds } })
            .select('CityName ZoneIncluded')
            .exec();
        // Map the cities to create a lookup for zone IDs
        const cityMap = cities.reduce((acc, city) => {
            city.ZoneIncluded.forEach(zoneId => {
                acc[zoneId.toString()] = city.CityName; // Convert ObjectId to string for mapping
            });
            return acc;
        }, {});
        // Attach city names to the zones
        const zonesWithCityNames = zones.map(zone => (Object.assign(Object.assign({}, zone.toObject()), { CityName: cityMap[zone._id.toString()] || null })));
        const total = yield route_model_1.ZoneModel.countDocuments().exec();
        const totalPages = Math.ceil(total / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        send_response_1.responseHandler.out(req, res, {
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
    }
    catch (error) {
        console.error(error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
});
exports.getAllZones = getAllZones;
const getZoneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Fetch the zone details, excluding the 'Localities' field
        const zone = yield route_model_1.ZoneModel.findById(id)
            .populate('CreatedBy', 'FirstName LastName PhoneNumber')
            .populate('UpdatedBy', 'FirstName LastName PhoneNumber')
            .select('-Localities')
            .exec();
        // If no zone is found, return a 404 response
        if (!zone) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Zone not found",
            });
        }
        // Fetch the city that includes this zone
        const city = yield route_model_1.CityModel.findOne({ ZoneIncluded: { $in: id } })
            .select('CityName _id') // Only return CityName and _id fields        
            // .populate('-CreatedBy')
            // .populate('-UpdatedBy')
            // .populate('-ZoneIncluded')
            // .populate('-RouteIncluded')
            .exec();
        // If no city is found, return a 404 response
        if (!city) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "City not found for this zone",
            });
        }
        // Return both the zone and the city
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Zone and city fetched successfully",
            data: { zone, city },
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.getZoneById = getZoneById;
const updateZone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(req.body);
    const LoggedInId = req['decodedToken'].id;
    if (!LoggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    try {
        const { ZoneName, City } = req.body;
        const trimmedZoneName = ZoneName.trim(); // Trim leading and trailing spaces
        // Check if a zone with the same name exists (case insensitive) but not the current zone
        const existingZoneByName = yield route_model_1.ZoneModel.findOne({
            ZoneName: { $regex: new RegExp(`^${trimmedZoneName}$`, 'i') },
            _id: { $ne: id }
        });
        if (existingZoneByName) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Zone with the same name already exists",
            });
        }
        let isCityExist = yield route_model_1.CityModel.findById({ _id: City });
        if (!isCityExist) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "City not found",
            });
        }
        const updatedZone = yield route_model_1.ZoneModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { UpdatedBy: LoggedInId, UpdatedAt: new Date() }), { new: true });
        if (!updatedZone) {
            return send_response_1.responseHandler.out(req, res, {
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
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Zone updated successfully",
            data: updatedZone
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.updateZone = updateZone;
const deleteZone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedZone = yield route_model_1.ZoneModel.findByIdAndDelete(id);
        if (!deletedZone) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Zone not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Zone deleted successfully",
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.deleteZone = deleteZone;
const updateZoneServiceable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { Serviceable } = req.body;
    const superAdminId = req['decodedToken'].id;
    if (!superAdminId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    if (typeof Serviceable !== 'boolean') {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: "Invalid Serviceable value",
        });
    }
    try {
        const updatedZone = yield route_model_1.ZoneModel.findByIdAndUpdate(id, {
            Serviceable,
            UpdatedBy: superAdminId,
            UpdatedAt: new Date(),
        }, { new: true });
        if (!updatedZone) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Zone not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Zone updated successfully",
            data: updatedZone
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.updateZoneServiceable = updateZoneServiceable;
// Going for route
const createRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const LoggedInId = req['decodedToken'].id;
    if (!LoggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    try {
        const { RouteName, ZonesIncluded } = req.body; // Expecting Zones as an array of { ZoneId, DeliverySequence }
        // Check if the route name already exists (case-insensitive)
        const existingRoute = yield route_model_1.RouteModel.findOne({
            RouteName: { $regex: new RegExp(`^${RouteName}$`, 'i') }
        });
        if (existingRoute) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Route name already exists",
            });
        }
        // Check for duplicate DeliverySequence values
        const deliverySequences = ZonesIncluded.map(zone => zone.DeliverySequence);
        const uniqueDeliverySequences = new Set(deliverySequences);
        if (uniqueDeliverySequences.size !== deliverySequences.length) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Duplicate Delivery Sequences found in Zones",
            });
        }
        const newRoute = new route_model_1.RouteModel({
            RouteName,
            ZonesIncluded: ZonesIncluded,
            CreatedBy: LoggedInId,
            UpdatedBy: LoggedInId,
        });
        yield newRoute.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Route created successfully",
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.createRoute = createRoute;
const updateRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const LoggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
    if (!LoggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    try {
        const { RouteName, ZonesIncluded, VehicleTagged } = req.body; // Include VehicleTagged in the request body
        // Check if the route name already exists (case-insensitive) and is not the current route
        const existingRoute = yield route_model_1.RouteModel.findOne({
            RouteName: { $regex: new RegExp(`^${RouteName}$`, 'i') },
            _id: { $ne: id }
        });
        if (existingRoute) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Route name already exists",
            });
        }
        // Validate that DeliverySequence is unique within the Zones array
        const sequences = ZonesIncluded.map(zone => zone.DeliverySequence);
        const hasDuplicate = sequences.length !== new Set(sequences).size;
        if (hasDuplicate) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Duplicate Delivery Sequences found in Zones",
            });
        }
        // Check for conflicting DeliverySequence values in other routes
        for (const zone of ZonesIncluded) {
            const { ZoneId, DeliverySequence } = zone;
            const conflictingRoutes = yield route_model_1.RouteModel.find({
                'ZonesIncluded.ZoneId': ZoneId,
                'ZonesIncluded.DeliverySequence': DeliverySequence,
                _id: { $ne: id } // Exclude the current route
            });
            if (conflictingRoutes.length > 0) {
                yield route_model_1.RouteModel.updateMany({
                    'ZonesIncluded.ZoneId': ZoneId,
                    'ZonesIncluded.DeliverySequence': { $gte: DeliverySequence },
                    _id: { $ne: id }
                }, { $inc: { 'ZonesIncluded.$.DeliverySequence': 1 } });
            }
        }
        const updatedRoute = yield route_model_1.RouteModel.findByIdAndUpdate(id, {
            RouteName,
            ZonesIncluded: ZonesIncluded,
            VehicleTagged, // Update VehicleTagged field
            UpdatedBy: LoggedInId
        }, { new: true });
        if (!updatedRoute) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Route not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Route updated successfully",
            data: updatedRoute
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.updateRoute = updateRoute;
const getRouteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const route = yield route_model_1.RouteModel.findById(id).populate('VehicleTagged').populate('ZonesIncluded').populate('CreatedBy').populate('UpdatedBy');
        if (!route) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Route not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Route retrieved successfully",
            data: route,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.getRouteById = getRouteById;
const deleteRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedRoute = yield route_model_1.RouteModel.findByIdAndDelete(id);
        if (!deletedRoute) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Route not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Route deleted successfully",
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.deleteRoute = deleteRoute;
const toggleRouteStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const LoggedInId = req['decodedToken'].id;
    const { Status } = req.body; // Status from the request body
    if (!LoggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    try {
        const route = yield route_model_1.RouteModel.findById(id);
        if (!route) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Route not found",
            });
        }
        route.Status = Status; // Set the status from the request body
        route.UpdatedBy = LoggedInId;
        route.UpdatedAt = new Date();
        yield route.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Route status updated successfully",
            data: route,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.toggleRouteStatus = toggleRouteStatus;
const getAllRoutes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Pagination parameters
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        // Fetch routes with pagination and populate fields
        const routes = yield route_model_1.RouteModel.find()
            .skip(skip)
            .limit(limit)
            .populate('VehicleTagged', 'VehicleName') // Adjust field as needed
            .populate('ZonesIncluded', 'ZoneName DeliverySequence') // Adjust fields as needed
            .populate('CreatedBy', 'FirstName LastName Email') // Adjust fields as needed
            .populate('UpdatedBy', 'FirstName LastName Email') // Adjust fields as needed
            .exec();
        // Get total count for pagination
        const total = yield route_model_1.RouteModel.countDocuments().exec();
        const totalPages = Math.ceil(total / limit);
        // Determine if previous or next pages exist
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        send_response_1.responseHandler.out(req, res, {
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
    }
    catch (error) {
        console.error(error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
});
exports.getAllRoutes = getAllRoutes;
// Going for city
const createCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const LoggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
    if (!LoggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized"
        });
    }
    let { CityName, Serviceable, SortOrder } = req.body;
    // Trim the CityName if it exists
    CityName = CityName === null || CityName === void 0 ? void 0 : CityName.trim();
    try {
        // Check if the city name already exists (case-insensitive)
        const existingCity = yield route_model_1.CityModel.findOne({
            CityName: { $regex: new RegExp(`^${CityName}$`, 'i') }
        });
        if (existingCity) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 403,
                message: "City name already exists"
            });
        }
        // Check if the sort order already exists
        if (SortOrder !== undefined) {
            const existingSortOrder = yield route_model_1.CityModel.findOne({ SortOrder });
            if (existingSortOrder) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 403,
                    message: "Sort order already exists"
                });
            }
        }
        const newCity = new route_model_1.CityModel({
            CityName,
            Serviceable,
            CreatedBy: LoggedInId,
            UpdatedBy: LoggedInId,
            SortOrder // Include SortOrder if it's part of the model
        });
        yield newCity.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "City created successfully",
            data: newCity
        });
    }
    catch (error) {
        console.error('Error creating city:', error); // Log error for debugging
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.createCity = createCity;
const getCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const city = yield route_model_1.CityModel.findById(id)
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
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.getCity = getCity;
const updateCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const LoggedInId = req['decodedToken'].id; // Extract LoggedInId from token
    if (!LoggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized"
        });
    }
    const { CityName, Serviceable } = req.body;
    try {
        // Check if the city name already exists (case-insensitive) and is not the current city
        const existingCity = yield route_model_1.CityModel.findOne({
            CityName: { $regex: new RegExp(`^${CityName}$`, 'i') },
            _id: { $ne: id }
        });
        if (existingCity) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "City name already exists"
            });
        }
        const updatedCity = yield route_model_1.CityModel.findByIdAndUpdate(id, {
            CityName,
            Serviceable,
            UpdatedBy: LoggedInId,
            UpdatedAt: new Date(),
        }, { new: true });
        if (!updatedCity) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "City not found"
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "City updated successfully",
            data: updatedCity
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: "Internal Server Error",
            data: error.message
        });
    }
});
exports.updateCity = updateCity;
const deleteCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const LoggedInId = req['decodedToken'].id; // Extract LoggedInId from token
    if (!LoggedInId) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized"
        });
    }
    try {
        const city = yield route_model_1.CityModel.findByIdAndDelete(id);
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
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.deleteCity = deleteCity;
const getAllCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPage = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (currentPage - 1) * limit;
        const city = yield route_model_1.CityModel.aggregate([
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
                    Serviceable: 1, // Example city field
                    SortOrder: 1, // Example city field
                    CreatedAt: 1, // Example city field
                    UpdatedAt: 1, // Example city field
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
        const total = yield route_model_1.CityModel.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Cities retrieved successfully",
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                citys: city
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.getAllCity = getAllCity;
const updateServiceableStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { Serviceable } = req.body; // Expecting a boolean value
    // Validate that the Serviceable field is a boolean
    if (typeof Serviceable !== 'boolean') {
        return res.status(400).json({
            status: false,
            message: "Serviceable status must be a boolean value"
        });
    }
    try {
        // Update the city document with the new Serviceable status
        const updatedCity = yield route_model_1.CityModel.findByIdAndUpdate(id, { Serviceable }, { new: true });
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
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.updateServiceableStatus = updateServiceableStatus;
const filterCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = req.query;
        const pipeline = [];
        // Ensure query parameters are correctly passed
        if (filters.CityName) {
            pipeline.push({
                $match: {
                    CityName: { $regex: new RegExp(filters.CityName, 'i') },
                },
            });
        }
        if (filters.SortOrder) {
            const sortOrder = parseInt(filters.SortOrder);
            if (!isNaN(sortOrder)) {
                pipeline.push({
                    $match: {
                        SortOrder: sortOrder,
                    },
                });
            }
            else {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid SortOrder value',
                });
            }
        }
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });
        const cities = yield route_model_1.CityModel.aggregate(pipeline);
        const total = yield route_model_1.CityModel.countDocuments();
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
    }
    catch (error) {
        console.error("Error in filterCities:", error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.filterCities = filterCities;
