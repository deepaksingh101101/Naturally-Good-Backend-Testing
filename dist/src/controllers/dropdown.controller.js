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
exports.editTypeOfCustomer = exports.deleteTypeOfCustomer = exports.getTypeOfCustomers = exports.createTypeOfCustomer = exports.editSourceOfCustomer = exports.deleteSourceOfCustomer = exports.getSourceOfCustomers = exports.createSourceOfCustomer = exports.deleteFrequencyType = exports.editFrequencyType = exports.createFrequencyType = exports.getFrequencyTypes = exports.editSubscriptionType = exports.deleteSubscriptionType = exports.createSubscriptionType = exports.getSubscriptionTypes = exports.editSeason = exports.deleteSeason = exports.getSeasons = exports.createSeason = exports.editRoster = exports.deleteRoster = exports.getRosters = exports.createRoster = exports.editProductType = exports.deleteProductType = exports.getTypes = exports.createProductType = void 0;
const dropdown_model_1 = require("../models/dropdown.model");
const send_response_1 = require("../utils/send-response");
// Common function to handle errors
const handleError = (req, res, error) => {
    return send_response_1.responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal Server Error',
        data: error.message
    });
};
// Create a new ProductType
const createProductType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, SortOrder } = req.body;
        const loggedInId = req['decodedToken'];
        // Check if required fields are present
        if (!Name || SortOrder === undefined) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 409,
                message: "Missing required fields",
            });
            // return res.status(400).json({ error: 'Missing required fields' });
        }
        // Check if Name already exists (ignoring case)
        const existingName = yield dropdown_model_1.ProductTypeModel.findOne({
            Name: { $regex: new RegExp(`^${Name.trim()}$`, 'i') } // Trimmed and case insensitive match
        });
        if (existingName) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 409,
                message: "Name already exists",
            });
            // return res.status(400).json({ error: 'Name already exists' });
        }
        // Check if SortOrder already exists
        const existingSortOrder = yield dropdown_model_1.ProductTypeModel.findOne({ SortOrder: SortOrder });
        if (existingSortOrder) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 409,
                message: "Sort order already exists",
            });
            // return res.status(400).json({ error: 'Sort order already exists' });
        }
        // Create new ProductType
        const newProductType = new dropdown_model_1.ProductTypeModel({ Name, SortOrder, CreatedBy: loggedInId, UpdatedBy: loggedInId });
        yield newProductType.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Created Successfully",
            data: newProductType,
        });
        // res.status(201).json(newProductType);
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.createProductType = createProductType;
// Get all Product Types
const getTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = yield dropdown_model_1.ProductTypeModel.find();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Fetched Successfully",
            data: types,
        });
        // return res.json(types);
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.getTypes = getTypes;
// Delete a ProductType by ID
const deleteProductType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = yield dropdown_model_1.ProductTypeModel.findByIdAndDelete(req.params.id);
        if (!type) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Type not found",
            });
            // return res.status(404).json({ error: 'Type not found' });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Product Type deleted successfully",
        });
        // return res.status(204).json({ message: 'Type deleted' });
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.deleteProductType = deleteProductType;
// Edit a Product Type
const editProductType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { Name, SortOrder } = req.body;
        const loggedInId = req['decodedToken'];
        // Find the existing ProductType by ID
        const existingProductType = yield dropdown_model_1.ProductTypeModel.findById(id);
        if (!existingProductType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "ProductType not found",
            });
            // return res.status(404).json({ error: 'ProductType not found' });
        }
        // Check if Name is provided and is not the same as the current one (ignoring case)
        if (Name) {
            const existingName = yield dropdown_model_1.ProductTypeModel.findOne({
                _id: { $ne: id },
                Name: { $regex: new RegExp(`^${Name.trim()}$`, 'i') }, // Trimmed and case insensitive match
            });
            if (existingName) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 409,
                    message: "Name already exists",
                });
                // return res.status(400).json({ error: 'Name already exists' });
            }
            existingProductType.Name = Name; // Update Name if provided
        }
        // Check if SortOrder is provided and is not the same as the current one
        if (SortOrder !== undefined) {
            const existingSortOrder = yield dropdown_model_1.ProductTypeModel.findOne({
                _id: { $ne: id },
                SortOrder: SortOrder,
            });
            if (existingSortOrder) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 409,
                    message: "Sort order already exists",
                });
                // return res.status(400).json({ error: 'Sort order already exists' });
            }
            existingProductType.SortOrder = SortOrder; // Update SortOrder if provided
        }
        // Update UpdatedBy if provided
        existingProductType.UpdatedBy = loggedInId;
        // Always update the UpdatedAt field
        existingProductType.UpdatedAt = new Date();
        // Save the changes
        yield existingProductType.save();
        // Respond with the updated ProductType
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Edited Successfully",
            data: existingProductType
        });
        // res.status(200).json(existingProductType);
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.editProductType = editProductType;
// Starting Roster
const createRoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, SortOrder } = req.body;
        const loggedInId = req['decodedToken'];
        // Check if required fields are present
        if (!Name || SortOrder === undefined) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Missing required fields",
            });
            // return res.status(400).json({ error: 'Missing required fields' });
        }
        // Check if Name already exists (ignoring case)
        const existingName = yield dropdown_model_1.RosterModel.findOne({
            Name: { $regex: new RegExp(`^${Name.trim()}$`, 'i') } // Trimmed and case insensitive match
        });
        if (existingName) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 409,
                message: "Name already exists",
            });
            // return res.status(400).json({ error: 'Name already exists' });
        }
        // Check if SortOrder already exists
        const existingSortOrder = yield dropdown_model_1.RosterModel.findOne({ SortOrder: SortOrder });
        if (existingSortOrder) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 409,
                message: "Sort order already exists",
            });
            // return res.status(400).json({ error: 'Sort order already exists' });
        }
        // Create new Roster
        const newRoster = new dropdown_model_1.RosterModel({ Name, SortOrder, CreatedBy: loggedInId, UpdatedBy: loggedInId });
        yield newRoster.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Created Successfully",
            data: newRoster,
        });
        // res.status(201).json(newRoster);
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createRoster = createRoster;
//get all roster 
const getRosters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rosters = yield dropdown_model_1.RosterModel.find();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Rosters fetched successfully",
            data: rosters,
        });
        // return res.json(rosters);
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.getRosters = getRosters;
// Delete roster
const deleteRoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roster = yield dropdown_model_1.RosterModel.findByIdAndDelete(req.params.id);
        if (!roster) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Roster not found",
            });
            // return res.status(404).json({ error: 'Roster not found' });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Roster deleted successfully",
        });
        // return res.status(204).json({ message: 'Roster deleted' });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteRoster = deleteRoster;
// Edit roster
const editRoster = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { Name, SortOrder } = req.body;
        const loggedInId = req['decodedToken'];
        // Find the existing Roster by ID
        const existingRoster = yield dropdown_model_1.RosterModel.findById(id);
        if (!existingRoster) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Roster not found",
            });
            // return res.status(404).json({ error: 'Roster not found' });
        }
        // Check if Name is provided and is not the same as the current one (ignoring case)
        if (Name) {
            const existingName = yield dropdown_model_1.RosterModel.findOne({
                _id: { $ne: id },
                Name: { $regex: new RegExp(`^${Name.trim()}$`, 'i') } // Trimmed and case insensitive match
            });
            if (existingName) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 409,
                    message: "Name already exists",
                });
                // return res.status(400).json({ error: 'Name already exists' });
            }
            existingRoster.Name = Name; // Update Name if provided
        }
        // Check if SortOrder is provided and is not the same as the current one
        if (SortOrder !== undefined) {
            const existingSortOrder = yield dropdown_model_1.RosterModel.findOne({
                _id: { $ne: id },
                SortOrder: SortOrder,
            });
            if (existingSortOrder) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 409,
                    message: "Sort order already exists",
                });
                // return res.status(400).json({ error: 'Sort order already exists' });
            }
            existingRoster.SortOrder = SortOrder; // Update SortOrder if provided
        }
        // Update UpdatedBy if provided
        existingRoster.UpdatedBy = loggedInId;
        // Always update the UpdatedAt field
        existingRoster.UpdatedAt = new Date();
        // Save the changes
        yield existingRoster.save();
        // Respond with the updated Roster
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Sort updated successfully",
            data: existingRoster,
        });
        // res.status(200).json(existingRoster);
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.editRoster = editRoster;
// Create a new Season
const createSeason = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name } = req.body;
        const loggedInId = req['decodedToken'];
        // Check if required fields are present
        if (!Name) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Name is required",
            });
            // return res.status(400).json({ error: 'Name is required' });
        }
        // Check if Name already exists (ignoring case)
        const existingSeason = yield dropdown_model_1.SeasonModel.findOne({
            Name: { $regex: new RegExp(`^${Name.trim()}$`, 'i') } // Trimmed and case insensitive match
        });
        if (existingSeason) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Season name already exists",
            });
            // return res.status(400).json({ error: 'Season name already exists' });
        }
        // Create new Season
        const newSeason = new dropdown_model_1.SeasonModel({
            Name,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId
        });
        yield newSeason.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Season created successfully",
            data: newSeason,
        });
        // res.status(201).json(newSeason);
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createSeason = createSeason;
// Get all Seasons
const getSeasons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seasons = yield dropdown_model_1.SeasonModel.find(); // Populate with Employee name
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Season Fetched successfully",
            data: seasons
        });
        // return res.json(seasons);
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getSeasons = getSeasons;
// Delete a Season by ID
const deleteSeason = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const season = yield dropdown_model_1.SeasonModel.findByIdAndDelete(req.params.id);
        if (!season) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Season not found",
            });
            // return res.status(404).json({ error: 'Season not found' });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Season deleted successfully",
        });
        // return res.status(204).json({ message: 'Season deleted' });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteSeason = deleteSeason;
// Edit a Season
const editSeason = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { Name } = req.body;
        const loggedInId = req['decodedToken'];
        // Find the existing Season by ID
        const existingSeason = yield dropdown_model_1.SeasonModel.findById(id);
        if (!existingSeason) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Season not found",
            });
            // return res.status(404).json({ error: 'Season not found' });
        }
        // Check if Name is provided and is not the same as the current one (ignoring case)
        if (Name) {
            const existingName = yield dropdown_model_1.SeasonModel.findOne({
                _id: { $ne: id },
                Name: { $regex: new RegExp(`^${Name.trim()}$`, 'i') } // Trimmed and case insensitive match
            });
            if (existingName) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Season name already exists",
                });
                // return res.status(400).json({ error: 'Season name already exists' });
            }
            existingSeason.Name = Name; // Update Name if provided
        }
        // Update UpdatedBy and UpdatedAt fields
        existingSeason.UpdatedBy = loggedInId;
        existingSeason.UpdatedAt = new Date();
        // Save the changes
        yield existingSeason.save();
        // Respond with the updated Season
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Season updated successfully",
            data: existingSeason,
        });
        // res.status(200).json(existingSeason);
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // res.status(500).json({ error: 'Internal server error' });
    }
});
exports.editSeason = editSeason;
// Create Subscription Type
const getSubscriptionTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriptionTypes = yield dropdown_model_1.SubscriptionTypeModel.find();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Subscription Type Fetched successfully",
            data: subscriptionTypes
        });
        // return res.json(subscriptionTypes);
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.getSubscriptionTypes = getSubscriptionTypes;
const createSubscriptionType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, Value } = req.body;
        const loggedInId = req['decodedToken']; // Get logged-in user ID
        if (!Name || Value === undefined || !loggedInId) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Missing required fields or user ID",
            });
            // return res.status(400).json({ error: 'Missing required fields or user ID' });
        }
        const name = Name.toLowerCase();
        // Check if subscription type with the same name already exists
        const existing = yield dropdown_model_1.SubscriptionTypeModel.findOne({
            Name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
        });
        if (existing) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 403,
                message: "Subscription Type already exists",
            });
            // return res.status(400).json({ error: 'Subscription Type already exists' });
        }
        const newSubscriptionType = new dropdown_model_1.SubscriptionTypeModel({
            Name: name,
            Value,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId
        });
        yield newSubscriptionType.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Subscription Type  created successfully",
            data: newSubscriptionType,
        });
        // res.status(201).json(newSubscriptionType);
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.createSubscriptionType = createSubscriptionType;
const deleteSubscriptionType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriptionType = yield dropdown_model_1.SubscriptionTypeModel.findByIdAndDelete(req.params.id);
        if (!subscriptionType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Subscription Type not found",
            });
            // return res.status(404).json({ error: 'Subscription Type not found' });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Subscription Type deleted",
        });
        // return res.status(204).json({ message: 'Subscription Type deleted' });
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.deleteSubscriptionType = deleteSubscriptionType;
const editSubscriptionType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { Name, Value } = req.body;
        const loggedInId = req['decodedToken']; // Get logged-in user ID
        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Invalid subscription type ID format",
            });
            // return res.status(400).json({ error: 'Invalid subscription type ID format' });
        }
        // Check if the logged-in user ID is available
        if (!loggedInId) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "User ID is required",
            });
            // return res.status(400).json({ error: 'User ID is required' });
        }
        // Prepare update object
        const updateData = { UpdatedBy: loggedInId };
        // If Name is provided, validate and include it in the update
        if (Name) {
            const name = Name.toLowerCase();
            const existing = yield dropdown_model_1.SubscriptionTypeModel.findOne({ Name: name, _id: { $ne: id } });
            if (existing) {
                return send_response_1.responseHandler.out(req, res, {
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
        const updatedSubscriptionType = yield dropdown_model_1.SubscriptionTypeModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedSubscriptionType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Subscription Type not found",
            });
            // return res.status(404).json({ error: 'Subscription Type not found' });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Subscription Type updated successfully",
            data: updatedSubscriptionType
        });
        // return res.status(200).json(updatedSubscriptionType);
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.editSubscriptionType = editSubscriptionType;
// Frequency Type
const getFrequencyTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frequencyTypes = yield dropdown_model_1.FrequencyTypeModel.find();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Frequency Type fetched successfully",
            data: frequencyTypes
        });
        // return res.status(200).json(frequencyTypes);
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.getFrequencyTypes = getFrequencyTypes;
const createFrequencyType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, Value, DayBasis } = req.body;
        // Trim the Name to remove leading or trailing whitespace
        const trimmedName = Name ? Name.trim() : '';
        if (!trimmedName || Value === undefined || !DayBasis) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Missing required fields",
            });
        }
        // Check if Frequency Type with the same trimmed Name already exists
        const existing = yield dropdown_model_1.FrequencyTypeModel.findOne({
            Name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
        });
        if (existing) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 403,
                message: "Frequency Type with the same Name already exists",
            });
        }
        // Create and save the new Frequency Type
        const newFrequencyType = new dropdown_model_1.FrequencyTypeModel({ Name: trimmedName, Value, DayBasis });
        yield newFrequencyType.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Frequency Type created successfully",
            data: newFrequencyType
        });
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.createFrequencyType = createFrequencyType;
const editFrequencyType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { Name, Value, DayBasis } = req.body;
        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Invalid frequency type ID format",
            });
        }
        // Prepare update object
        const updateData = {};
        // If Name is provided, validate and include it in the update
        if (Name) {
            // Check if a Frequency Type with the same Name, Value, and DayBasis already exists (case-insensitive)
            const existing = yield dropdown_model_1.FrequencyTypeModel.findOne({
                Name: { $regex: new RegExp(`^${Name}$`, 'i') },
                Value,
                DayBasis,
                _id: { $ne: id }
            });
            if (existing) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Frequency Type with the same Name, Value, and DayBasis already exists",
                });
            }
            updateData.Name = Name;
        }
        // If Value is provided, include it in the update
        if (Value !== undefined) {
            updateData.Value = Value;
        }
        // If DayBasis is provided, include it in the update
        if (DayBasis) {
            updateData.DayBasis = DayBasis;
        }
        // Find and update the frequency type
        const updatedFrequencyType = yield dropdown_model_1.FrequencyTypeModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedFrequencyType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Frequency Type not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Frequency Type updated successfully",
            data: updatedFrequencyType
        });
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.editFrequencyType = editFrequencyType;
const deleteFrequencyType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frequencyType = yield dropdown_model_1.FrequencyTypeModel.findByIdAndDelete(req.params.id);
        if (!frequencyType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Frequency Type not found",
            });
            // return res.status(404).json({ error: 'Frequency Type not found' });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Frequency Type deleted",
        });
        // return res.status(204).json({ message: 'Frequency Type deleted' });
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.deleteFrequencyType = deleteFrequencyType;
const createSourceOfCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name } = req.body;
        const loggedInId = req['decodedToken'];
        if (!Name) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Name is required",
            });
        }
        const existingSource = yield dropdown_model_1.SourceOfCustomerModel.findOne({ Name: { $regex: new RegExp(`^${Name}$`, 'i') } });
        if (existingSource) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 403,
                message: "Source type  already exists",
            });
        }
        const newSource = new dropdown_model_1.SourceOfCustomerModel({
            Name,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId
        });
        yield newSource.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Source of Customer created successfully",
            data: newSource,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.createSourceOfCustomer = createSourceOfCustomer;
// Get all SourceOfCustomers
const getSourceOfCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sources = yield dropdown_model_1.SourceOfCustomerModel.find();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Sources of Customer fetched successfully",
            data: sources,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.getSourceOfCustomers = getSourceOfCustomers;
// Delete a SourceOfCustomer by ID
const deleteSourceOfCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const source = yield dropdown_model_1.SourceOfCustomerModel.findByIdAndDelete(req.params.id);
        if (!source) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Source of Customer not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Source of Customer deleted successfully",
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.deleteSourceOfCustomer = deleteSourceOfCustomer;
// Edit a SourceOfCustomer
const editSourceOfCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { Name } = req.body;
        const loggedInId = req['decodedToken'];
        const existingSource = yield dropdown_model_1.SourceOfCustomerModel.findById(id);
        if (!existingSource) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Source of Customer not found",
            });
        }
        if (Name) {
            const existingName = yield dropdown_model_1.SourceOfCustomerModel.findOne({
                _id: { $ne: id },
                Name: { $regex: new RegExp(`^${Name}$`, 'i') },
            });
            if (existingName) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Source of Customer name already exists",
                });
            }
            existingSource.Name = Name;
        }
        existingSource.UpdatedBy = loggedInId;
        yield existingSource.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Source of Customer updated successfully",
            data: existingSource,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.editSourceOfCustomer = editSourceOfCustomer;
// Create a new TypeOfCustomer
const createTypeOfCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name } = req.body;
        const loggedInId = req['decodedToken'];
        if (!Name) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Name is required",
            });
        }
        const existingType = yield dropdown_model_1.TypeOfCustomerModel.findOne({ Name: { $regex: new RegExp(`^${Name}$`, 'i') } });
        if (existingType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 403,
                message: "Type of Customer name already exists",
            });
        }
        const newType = new dropdown_model_1.TypeOfCustomerModel({
            Name,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId
        });
        yield newType.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Type of Customer created successfully",
            data: newType,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.createTypeOfCustomer = createTypeOfCustomer;
// Get all TypeOfCustomers
const getTypeOfCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = yield dropdown_model_1.TypeOfCustomerModel.find();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Types of Customer fetched successfully",
            data: types,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.getTypeOfCustomers = getTypeOfCustomers;
// Delete a TypeOfCustomer by ID
const deleteTypeOfCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = yield dropdown_model_1.TypeOfCustomerModel.findByIdAndDelete(req.params.id);
        if (!type) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Type of Customer not found",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Type of Customer deleted successfully",
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.deleteTypeOfCustomer = deleteTypeOfCustomer;
// Edit a TypeOfCustomer
const editTypeOfCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { Name } = req.body;
        const loggedInId = req['decodedToken'];
        const existingType = yield dropdown_model_1.TypeOfCustomerModel.findById(id);
        if (!existingType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Type of Customer not found",
            });
        }
        if (Name) {
            const existingName = yield dropdown_model_1.TypeOfCustomerModel.findOne({
                _id: { $ne: id },
                Name: { $regex: new RegExp(`^${Name}$`, 'i') },
            });
            if (existingName) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Type of Customer name already exists",
                });
            }
            existingType.Name = Name;
        }
        existingType.UpdatedBy = loggedInId;
        existingType.UpdatedAt = new Date();
        yield existingType.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Type of Customer updated successfully",
            data: existingType,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.editTypeOfCustomer = editTypeOfCustomer;
