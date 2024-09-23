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
exports.getComplaintByLoggedInUser = exports.getComplaintById = exports.getAllComplaintsByAdmin = exports.deleteComplaint = exports.updateComplaint = exports.createComplaint = exports.deleteComplainType = exports.updateComplainType = exports.getComplainTypeById = exports.getAllComplainTypes = exports.createComplainType = void 0;
const complaints_model_1 = __importDefault(require("../../models/complaints.model"));
const complaintsType_model_1 = __importDefault(require("../../models/complaintsType.model"));
const order_model_1 = __importDefault(require("../../models/order.model"));
const send_response_1 = require("../../utils/send-response");
// Create Compliment Type
const createComplainType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { ComplaintType, Status, Description } = req.body;
    const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
    if (!loggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'Forbidden'
        });
    }
    // Validate required fields
    if (!ComplaintType || typeof ComplaintType !== 'string') {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'ComplaintType is required and must be a string'
        });
    }
    try {
        // Check if the complaint type already exists (case-insensitive)
        const existingComplaintType = yield complaintsType_model_1.default.findOne({
            ComplaintType: { $regex: new RegExp(`^${ComplaintType.trim()}$`, 'i') }
        });
        if (existingComplaintType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 403,
                message: 'ComplaintType already exists'
            });
        }
        // Create a new Complaint Type
        const newComplaintType = new complaintsType_model_1.default({
            ComplaintType,
            Status,
            Description,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId,
        });
        // Save to the database
        yield newComplaintType.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Complaint Type created successfully",
            data: newComplaintType
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.createComplainType = createComplainType;
// Get all Compliment Types
const getAllComplainTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        const complainTypes = yield complaintsType_model_1.default.find()
            .skip(skip)
            .limit(limit)
            .populate('CreatedBy', 'FirstName LastName Email PhoneNumber')
            .populate('UpdatedBy', 'FirstName LastName Email PhoneNumber')
            .exec();
        const total = yield complaintsType_model_1.default.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Compliment Types fetched successfully",
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                complainTypes,
            }
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.getAllComplainTypes = getAllComplainTypes;
// Get a Compliment Type by ID
const getComplainTypeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const complimentType = yield complaintsType_model_1.default.findById(id)
            .populate('CreatedBy', '-Password')
            .populate('UpdatedBy', '-Password')
            .exec();
        if (!complimentType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Compliment Type not found'
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Compliment Type fetched successfully",
            data: complimentType
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.getComplainTypeById = getComplainTypeById;
// Update Compliment Type by ID
const updateComplainType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { ComplaintType, Status, Description } = req.body;
    const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const complaintType = yield complaintsType_model_1.default.findById(id);
        if (!complaintType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Complaint Type not found'
            });
        }
        if (ComplaintType && typeof ComplaintType !== 'string') {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'ComplaintType must be a string'
            });
        }
        // Check if the updated complaint type already exists (case-insensitive)
        if (ComplaintType) {
            const existingComplaintType = yield complaintsType_model_1.default.findOne({
                _id: { $ne: id },
                ComplaintType: { $regex: new RegExp(`^${ComplaintType}$`, 'i') }
            });
            if (existingComplaintType) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Another ComplaintType with the same name already exists'
                });
            }
        }
        // Update fields
        complaintType.ComplaintType = ComplaintType || complaintType.ComplaintType;
        complaintType.Status = Status || complaintType.Status;
        complaintType.Description = Description || complaintType.Description;
        complaintType.UpdatedBy = loggedInId;
        // Save to the database
        yield complaintType.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Complaint Type updated successfully',
            data: complaintType
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.updateComplainType = updateComplainType;
// Delete Compliment Type by ID
const deleteComplainType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const complimentType = yield complaintsType_model_1.default.findByIdAndDelete(id);
        if (!complimentType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Compliment Type not found'
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Compliment Type deleted successfully'
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.deleteComplainType = deleteComplainType;
// Create complain by admin or user
const createComplaint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const loggedInId = ((_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req['userId']) === null || _b === void 0 ? void 0 : _b.id);
    const { DeliveryId, UserId, ComplaintTypeId, Status = 'active', Description, } = req.body;
    if (!loggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'Forbidden'
        });
    }
    try {
        // Fetch the order associated with the user and populate deliveries
        const orderInfo = yield order_model_1.default.findOne({ UserId: ((_c = req['decodedToken']) === null || _c === void 0 ? void 0 : _c.id) ? UserId : (_d = req['userId']) === null || _d === void 0 ? void 0 : _d.id }).populate('Deliveries');
        if (!orderInfo) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Order not found'
            });
        }
        console.log(orderInfo);
        // Check if the delivery belongs to the user
        const deliveryExists = orderInfo.Deliveries.some((delivery) => {
            return delivery._id.toString() === DeliveryId;
        });
        if (!deliveryExists) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Delivery does not exist or does not belong to this user'
            });
        }
        // Check if a complaint already exists for the same DeliveryId
        const existingComplaint = yield complaints_model_1.default.findOne({ DeliveryId });
        if (existingComplaint) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'A complaint already exists for this delivery'
            });
        }
        // Create a new complaint
        const newComplaint = new complaints_model_1.default({
            DeliveryId,
            UserId: ((_e = req['decodedToken']) === null || _e === void 0 ? void 0 : _e.id) ? UserId : (_f = req['userId']) === null || _f === void 0 ? void 0 : _f.id,
            ComplaintTypeId,
            Status,
            Description,
            CreatedBy: req['decodedToken'] || null,
            UpdatedBy: req['decodedToken'] || null
        });
        yield newComplaint.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: 'Complaint created successfully',
            data: newComplaint
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.createComplaint = createComplaint;
// Update complain by admin
const updateComplaint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
    const { DeliveryId, UserId, ComplaintTypeId, Status, Description, } = req.body;
    if (!loggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'Forbidden'
        });
    }
    try {
        const complaint = yield complaints_model_1.default.findById(id);
        if (!complaint) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Complaint not found'
            });
        }
        // Update fields if they are provided
        if (DeliveryId)
            complaint.DeliveryId = DeliveryId;
        if (UserId)
            complaint.UserId = UserId;
        if (ComplaintTypeId)
            complaint.ComplaintTypeId = ComplaintTypeId;
        if (Status)
            complaint.Status = Status;
        if (Description !== undefined)
            complaint.Description = Description;
        complaint.UpdatedBy = loggedInId;
        yield complaint.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Complaint updated successfully',
            data: complaint
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.updateComplaint = updateComplaint;
//Delete complain by admin
const deleteComplaint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const complaint = yield complaints_model_1.default.findByIdAndDelete(id);
        if (!complaint) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Complaint not found'
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Complaint deleted successfully'
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.deleteComplaint = deleteComplaint;
// Get all complains by admin
const getAllComplaintsByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        const complaints = yield complaints_model_1.default.find()
            .skip(skip)
            .limit(limit)
            .populate('UserId', 'FirstName LastName Email Phone')
            .populate('ComplaintTypeId', 'ComplaintType')
            .populate('DeliveryId', 'DeliveryDate DeliveryTime ');
        const total = yield complaints_model_1.default.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Complaints fetched successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                complaints,
            }
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.getAllComplaintsByAdmin = getAllComplaintsByAdmin;
// Resolve complains by admin
// Get one complain by admin 
const getComplaintById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const complaintId = req.params.id;
        if (!complaintId) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Complaint ID is required'
            });
        }
        const complaint = yield complaints_model_1.default.findById(complaintId)
            .populate('UserId')
            .populate('ComplaintTypeId', 'ComplaintType')
            .populate('DeliveryId');
        if (!complaint) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Complaint not found'
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Complaint fetched successfully',
            data: complaint
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.getComplaintById = getComplaintById;
// get complaint of logged in user
const getComplaintByLoggedInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInId = (_a = req['userId']) === null || _a === void 0 ? void 0 : _a.id;
        if (!loggedInId) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'User ID not found'
            });
        }
        const complaint = yield complaints_model_1.default.find({ UserId: loggedInId })
            .populate('ComplaintTypeId', 'ComplaintType')
            .populate('DeliveryId');
        if (!complaint) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Complaint not found'
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Complaint fetched successfully',
            data: complaint
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.getComplaintByLoggedInUser = getComplaintByLoggedInUser;
