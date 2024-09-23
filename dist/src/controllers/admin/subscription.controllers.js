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
exports.searchSubscription = exports.filterSubscriptions = exports.deleteSubscription = exports.updateSubscriptionStatus = exports.updateSubscription = exports.getSubscriptionById = exports.getAllSubscriptions = exports.createSubscription = void 0;
const subscription_model_1 = __importDefault(require("../../models/subscription.model"));
const dropdown_model_1 = require("../../models/dropdown.model");
const bag_model_1 = require("../../models/bag.model");
const send_response_1 = require("../../utils/send-response");
const createSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        const { SubscriptionTypeId, FrequencyId, TotalDeliveryNumber, Visibility, Status, Bag, DeliveryDays, OriginalPrice, Offer, NetPrice, ImageUrl, Description } = req.body;
        // Check if all required fields are present
        if (!SubscriptionTypeId || !FrequencyId || !TotalDeliveryNumber || !Visibility || !Status || !Bag || !DeliveryDays || !OriginalPrice || !NetPrice || !Description) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Missing required fields'
            });
        }
        const isSubscriptionTypeExist = yield dropdown_model_1.SubscriptionTypeModel.findById(SubscriptionTypeId);
        if (!isSubscriptionTypeExist) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Subscription Type not found'
            });
        }
        const isFrequencyExist = yield dropdown_model_1.FrequencyTypeModel.findById(FrequencyId);
        if (!isFrequencyExist) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Frequency Type not found'
            });
        }
        const isBagExist = yield bag_model_1.BagModel.findById(Bag);
        if (!isBagExist) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Bag not found'
            });
        }
        const isSubscriptionExist = yield subscription_model_1.default.find({
            SubscriptionTypeId,
            FrequencyId,
            Bag,
            DeliveryDays,
            TotalDeliveryNumber
        });
        if (isSubscriptionExist.length > 0) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Subscription already exist'
            });
        }
        const subscription = new subscription_model_1.default({
            SubscriptionTypeId,
            FrequencyId,
            TotalDeliveryNumber,
            Visibility,
            Status,
            Bag,
            DeliveryDays,
            OriginalPrice,
            Offer,
            NetPrice,
            ImageUrl,
            Description,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId
        });
        yield subscription.save();
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: 'Subscription created successfully',
            data: subscription
        });
    }
    catch (error) {
        console.error('Error creating subscription:', error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.createSubscription = createSubscription;
const getAllSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        // Populate SubscriptionTypeId, FrequencyId, and Bag fields
        const subscriptions = yield subscription_model_1.default.find()
            .skip(skip)
            .limit(limit)
            .populate('SubscriptionTypeId') // Populate SubscriptionTypeId field
            .populate('FrequencyId') // Populate FrequencyId field
            .populate('Bag'); // Populate Bag field
        const total = yield subscription_model_1.default.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Subscriptions fetched successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                subscriptions,
            }
        });
    }
    catch (error) {
        console.error('Error fetching subscriptions:', error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.getAllSubscriptions = getAllSubscriptions;
const getSubscriptionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid subscription ID format'
            });
        }
        // Populate SubscriptionTypeId, FrequencyId, Bag, CreatedBy, and UpdatedBy fields
        const subscription = yield subscription_model_1.default.findById(id)
            .populate('SubscriptionTypeId') // Populate SubscriptionTypeId field
            .populate('FrequencyId') // Populate FrequencyId field
            .populate('CreatedBy') // Populate CreatedBy field
            .populate('UpdatedBy') // Populate UpdatedBy field
            .populate({
            path: 'Bag', // Populate Bag field
            populate: {
                path: 'AllowedItems', // Populate AllowedItems within Bag
                model: 'Product', // Ensure to use the correct model name if it's different
            },
        });
        if (!subscription) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Subscription not found'
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Subscription fetched successfully',
            data: subscription
        });
    }
    catch (error) {
        console.error('Error fetching subscription by ID:', error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.getSubscriptionById = getSubscriptionById;
const updateSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const AdminId = req['adminId'];
        const { SubscriptionTypeId, FrequencyId, Bags } = req.body;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid subscription ID format'
            });
        }
        // Check if the referenced FrequencyType exists
        if (FrequencyId) {
            const frequencyType = yield dropdown_model_1.FrequencyTypeModel.findById(FrequencyId);
            if (!frequencyType) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid FrequencyType ID'
                });
            }
        }
        // Check if the referenced SubscriptionType exists
        if (SubscriptionTypeId) {
            const subscriptionType = yield dropdown_model_1.SubscriptionTypeModel.findById(SubscriptionTypeId);
            if (!subscriptionType) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid SubscriptionType ID'
                });
            }
        }
        // Check if the referenced Bags exist
        if (Bags && Bags.length > 0) {
            for (const bagId of Bags) {
                const bag = yield bag_model_1.BagModel.findById(bagId);
                if (!bag) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `Invalid Bag ID: ${bagId}`
                    });
                }
            }
        }
        const subscription = yield subscription_model_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { updatedBy: AdminId, UpdatedAt: new Date().toISOString() }), { new: true, runValidators: true });
        if (!subscription) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Subscription not found'
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Subscription updated successfully',
            data: subscription
        });
    }
    catch (error) {
        console.error('Error updating subscription:', error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.updateSubscription = updateSubscription;
const updateSubscriptionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { Status } = req.body;
        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid Subscription ID format'
            });
        }
        // Ensure `Status` is a boolean
        if (typeof Status !== 'boolean') {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Status must be a boolean value'
            });
        }
        // Update the Status field of the Subscription
        const updatedSubscription = yield subscription_model_1.default.findByIdAndUpdate(id, { Status: Status }, { new: true } // Return the updated document
        );
        if (!updatedSubscription) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Subscription not found'
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Subscription status updated successfully',
            data: updatedSubscription
        });
    }
    catch (error) {
        console.error('Error updating subscription status:', error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.updateSubscriptionStatus = updateSubscriptionStatus;
// Not working or not needed
const deleteSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid subscription ID format' });
        }
        const subscription = yield subscription_model_1.default.findByIdAndDelete(id);
        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteSubscription = deleteSubscription;
const filterSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = req.query;
        const query = {};
        if (filters.SubscriptionTypeId) {
            query.SubscriptionTypeId = filters.SubscriptionTypeId;
        }
        if (filters.FrequencyId) {
            query.FrequencyId = filters.FrequencyId;
        }
        if (filters.Visibility) {
            query.Visibility = filters.Visibility;
        }
        if (filters.Status) {
            query.Status = filters.Status;
        }
        if (filters.OriginalPrice) {
            query.OriginalPrice = +filters.OriginalPrice;
        }
        if (filters.NetPrice) {
            query.NetPrice = +filters.NetPrice;
        }
        const subscriptions = yield subscription_model_1.default.find(query);
        if (subscriptions.length === 0) {
            return res.status(404).json({ error: 'Subscriptions not found' });
        }
        res.status(200).json(subscriptions);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.filterSubscriptions = filterSubscriptions;
const searchSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const filters = req.query;
        const pipeline = [];
        // Pagination setup
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        // Filter based on term
        if (filters.term) {
            const term = filters.term;
            pipeline.push({
                $lookup: {
                    from: 'subscriptiontypes', // Collection name for SubscriptionType
                    localField: 'SubscriptionTypeId',
                    foreignField: '_id',
                    as: 'subscriptionType',
                },
            }, {
                $lookup: {
                    from: 'frequencytypes', // Collection name for FrequencyType
                    localField: 'FrequencyId',
                    foreignField: '_id',
                    as: 'frequencyType',
                },
            }, {
                $lookup: {
                    from: 'bags', // Collection name for Bag
                    localField: 'Bag',
                    foreignField: '_id',
                    as: 'bag',
                },
            }, {
                $match: {
                    $or: [
                        { 'subscriptionType.Name': { $regex: new RegExp(term, 'i') } },
                        { 'frequencyType.Name': { $regex: new RegExp(term, 'i') } },
                        { 'bag.BagName': { $regex: new RegExp(term, 'i') } },
                    ],
                },
            });
        }
        // Add pagination to the pipeline
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });
        // Execute the aggregation pipeline
        const subscriptions = yield subscription_model_1.default.aggregate(pipeline);
        // Count documents after filtering for total count
        const countPipeline = [...pipeline];
        countPipeline.pop(); // Remove limit stage for count
        countPipeline.pop(); // Remove skip stage for count
        const total = yield subscription_model_1.default.aggregate([...countPipeline, { $count: 'total' }]);
        const totalCount = ((_a = total[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        const totalPages = Math.ceil(totalCount / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        if (subscriptions.length === 0) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'No Subscription found matching the criteria.',
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Subscriptions retrieved successfully',
            data: {
                total: totalCount,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                subscriptions,
            },
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
exports.searchSubscription = searchSubscription;
