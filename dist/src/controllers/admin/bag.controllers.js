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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBags = exports.deleteBag = exports.toggleBagStatus = exports.getOneBag = exports.updateBag = exports.getAllBags = exports.createBagByAdmin = void 0;
const product_model_1 = __importDefault(require("../../models/product.model"));
const bag_model_1 = require("../../models/bag.model");
const send_response_1 = require("../../utils/send-response");
const createBagByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        const { BagName, BagMaxWeight, BagVisibility, Status, BagImageUrl, BagDescription, AllowedItems, // Array of Product IDs
         } = req.body;
        // Validate input
        if (!BagName || !BagMaxWeight || !BagVisibility || !Status || !AllowedItems) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Missing required fields'
            });
        }
        // Validate allowedItems - check if all product IDs are valid
        const products = yield product_model_1.default.find({ _id: { $in: AllowedItems } });
        if (products.length !== AllowedItems.length) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Some products not found'
            });
        }
        const isBagExist = yield bag_model_1.BagModel.find({
            BagName, AllowedItems, BagMaxWeight
        });
        if (isBagExist.length > 0) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 403,
                message: 'Bag already exist'
            });
        }
        // Create a new Bag
        const bag = new bag_model_1.BagModel({
            BagName,
            BagMaxWeight,
            BagVisibility,
            Status,
            BagImageUrl,
            BagDescription,
            AllowedItems,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId,
        });
        console.log(bag);
        yield bag.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: 'Bag created successfully',
            data: bag
        });
    }
    catch (error) {
        console.log(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.createBagByAdmin = createBagByAdmin;
const getAllBags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        // Find all bags with pagination and populate necessary fields
        const bags = yield bag_model_1.BagModel.find()
            .skip(skip)
            .limit(limit)
            .populate({
            path: 'AllowedItems' // Adjust the fields you want to select from Product
        });
        const total = yield bag_model_1.BagModel.countDocuments(); // Total count of bags
        const totalPages = Math.ceil(total / limit); // Calculate total pages
        // Determine if there are previous and next pages
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        // Respond with paginated data
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Bags retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                bags
            }
        });
    }
    catch (error) {
        console.error('Error retrieving bags:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.getAllBags = getAllBags;
const updateBag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        console.log("id is " + id);
        const { AllowedItems } = req.body; // Array of Product IDs
        // Log the whole request body
        console.log("Request Body:", req.body);
        // Check if Bag exists
        const bag = yield bag_model_1.BagModel.findById(id);
        if (!bag) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Bag not found'
            });
        }
        console.log("AllowedItems:", AllowedItems);
        // Validate allowedItems - check if all product IDs are valid
        if (AllowedItems && Array.isArray(AllowedItems)) {
            // Extract valid product IDs from AllowedItems
            const validProductIds = AllowedItems.map(item => {
                return item.itemId; // Extract the itemId from each object
            });
            console.log("Valid Product IDs:", validProductIds);
            // Fetch products to check their existence
            const products = yield product_model_1.default.find({ _id: { $in: validProductIds } });
            if (products.length !== validProductIds.length) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Some products not found'
                });
            }
        }
        // Update the Bag using findByIdAndUpdate with additional fields
        const updatedBag = yield bag_model_1.BagModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { AllowedItems: AllowedItems.map(item => item.itemId), UpdatedBy: loggedInId }), {
            new: true, // Return the updated document
            runValidators: true, // Run validation checks
        });
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Bag updated successfully',
            data: updatedBag
        });
    }
    catch (error) {
        console.error('Error updating bag:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.updateBag = updateBag;
const getOneBag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if the ID is valid
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid bag ID format'
            });
        }
        // Find the Bag by ID and populate necessary fields
        const bag = yield bag_model_1.BagModel.findById(id)
            .populate({
            path: 'AllowedItems',
            populate: [
                {
                    path: 'Type',
                    select: 'Name'
                },
                {
                    path: 'Season',
                    select: 'Name'
                },
                {
                    path: 'Roster',
                    select: 'Name'
                }
            ]
        })
            .populate('CreatedBy', 'FirstName LastName PhoneNumber Email')
            .populate('UpdatedBy', 'FirstName LastName PhoneNumber Email');
        if (!bag) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Bag not found'
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Bag retrieved successfully',
            data: bag
        });
    }
    catch (error) {
        console.error('Error fetching bag:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.getOneBag = getOneBag;
const toggleBagStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { Status } = req.body;
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        // Validate bag ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid bag ID format'
            });
        }
        // Validate Status field
        if (typeof Status !== 'boolean') {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid value for Status. It must be true or false.'
            });
        }
        // Update the Status field
        const bag = yield bag_model_1.BagModel.findByIdAndUpdate(id, { Status, UpdatedBy: loggedInId }, { new: true, runValidators: true });
        if (!bag) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Bag not found'
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Bag status updated successfully',
            data: bag
        });
    }
    catch (error) {
        console.error('Error updating bag status:', error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.toggleBagStatus = toggleBagStatus;
const deleteBag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate bag ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid bag ID format'
            });
        }
        // Find and delete the Bag by ID
        const deletedBag = yield bag_model_1.BagModel.findByIdAndDelete(id);
        if (!deletedBag) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Bag not found'
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Bag deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting bag:', error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.deleteBag = deleteBag;
const filterBags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = req.query;
        const pipeline = [];
        // Pagination setup
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        // Match stage for filtering bags
        const matchConditions = {};
        // BagName filter using regex for case-insensitive match
        if (filters.BagName) {
            matchConditions.BagName = { $regex: new RegExp(filters.BagName, 'i') };
        }
        // BagMaxWeight filter
        if (filters.BagMaxWeight) {
            matchConditions.BagMaxWeight = +filters.BagMaxWeight; // Convert to number
        }
        // BagVisibility filter
        if (filters.BagVisibility) {
            matchConditions.BagVisibility = filters.BagVisibility;
        }
        // Status filter
        if (filters.Status) {
            matchConditions.Status = filters.Status === 'true'; // Convert to boolean
        }
        // Add main match stage for bags
        if (Object.keys(matchConditions).length > 0) {
            pipeline.push({ $match: matchConditions });
        }
        // Optional: Add lookups if you want to enrich bag data with related models
        // Example: Lookup for AllowedItems if needed
        if (filters.allowedItems) {
            pipeline.push({
                $lookup: {
                    from: 'products', // Assuming products are linked to bags
                    localField: 'AllowedItems',
                    foreignField: '_id',
                    as: 'AllowedItemsInfo',
                },
            });
        }
        // Add pagination to the pipeline
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });
        // Execute the aggregation pipeline
        const bags = yield bag_model_1.BagModel.aggregate(pipeline);
        const total = yield bag_model_1.BagModel.countDocuments(matchConditions); // Total documents count for pagination
        const totalPages = Math.ceil(total / limit); // Total number of pages
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        if (bags.length === 0) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'No bags found matching the criteria.',
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Bags retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                bags,
            },
        });
    }
    catch (error) {
        console.error(error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error.',
        });
    }
});
exports.filterBags = filterBags;
