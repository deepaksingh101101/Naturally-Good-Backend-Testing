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
exports.getSingleOrderByUser = exports.ApplyCouponsFromUserSide = exports.getAllOrdersByUser = exports.getOrderByIdByAdmin = exports.updateOrderStatus = exports.getAllOrdersByAdmin = exports.createOrderByAdmin = void 0;
const coupons_model_1 = __importDefault(require("../../models/coupons.model"));
const order_model_1 = __importDefault(require("../../models/order.model"));
const subscription_model_1 = __importDefault(require("../../models/subscription.model"));
const send_response_1 = require("../../utils/send-response");
const delivery_model_1 = __importDefault(require("../../models/delivery.model"));
const route_model_1 = require("../../models/route.model");
const user_model_1 = __importDefault(require("../../models/user.model"));
// Create order by admin
const createOrderByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { UserId, SubscriptionId, NetPrice, Coupon, ManualDiscountPercentage, AmountReceived, BookingDate, DeliveryStartDate, PaymentStatus, PaymentType, SpecialInstruction, PaymentDate, } = req.body;
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        if (!UserId || !SubscriptionId || !NetPrice || !BookingDate || !DeliveryStartDate || !PaymentStatus || !PaymentType) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Missing required fields'
            });
        }
        if (PaymentType !== 'cash' && !PaymentDate) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Missing required fields'
            });
        }
        let validCoupon;
        if (Coupon) {
            validCoupon = yield coupons_model_1.default.findById(Coupon);
            if (!validCoupon) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Invalid coupon'
                });
            }
            const currentDate = new Date();
            if (validCoupon.CouponVisibility === 'Private') {
                const isCouponAssignedToUser = validCoupon.AssignedTo.some((assigned) => assigned.Users.toString() === UserId.toString() && !assigned.isUsed);
                if (!isCouponAssignedToUser) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `Coupon ${validCoupon.Code} is not assigned or already used by the user`
                    });
                }
                if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `Coupon ${validCoupon.Code} is expired`
                    });
                }
            }
            else if (validCoupon.CouponVisibility === 'Public' || 'Admin') {
                const isCouponUsedByUser = validCoupon.UsedBy.includes(UserId);
                if (isCouponUsedByUser) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `Coupon ${validCoupon.Code} is already used by the user`
                    });
                }
                if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `Coupon ${validCoupon.Code} is expired`
                    });
                }
            }
            if (validCoupon.CouponType === 'Subscription' && !validCoupon.Subscriptions.includes(SubscriptionId)) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: `Coupon ${validCoupon.Code} is not valid for the given subscription`
                });
            }
        }
        const amountDue = NetPrice - AmountReceived;
        const order = new order_model_1.default({
            UserId: UserId,
            SubscriptionId: SubscriptionId,
            NetPrice: NetPrice,
            Coupons: Coupon,
            ManualDiscountPercentage: ManualDiscountPercentage,
            AmountReceived: AmountReceived,
            AmountDue: amountDue,
            BookingDate: new Date(BookingDate),
            DeliveryStartDate: new Date(DeliveryStartDate),
            PaymentStatus: PaymentStatus,
            PaymentType: PaymentType,
            SpecialInstruction: SpecialInstruction,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId,
        });
        const isOrderCreated = yield order.save();
        if (isOrderCreated && Coupon) {
            if (validCoupon.CouponVisibility === 'Public' || 'Admin') {
                validCoupon.UsedBy.push(UserId);
                yield validCoupon.save();
            }
            if (validCoupon.CouponVisibility === 'Private') {
                const userCoupon = validCoupon.AssignedTo.find((assigned) => assigned.Users.toString() === UserId.toString());
                if (userCoupon) {
                    userCoupon.isUsed = true;
                    yield validCoupon.save();
                }
            }
            validCoupon.RevenueGenerated += NetPrice;
            yield validCoupon.save();
        }
        if (isOrderCreated) {
            try {
                const subscription = yield subscription_model_1.default.findById(SubscriptionId)
                    .populate('FrequencyId')
                    .populate('Bag');
                if (!subscription) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 404,
                        message: 'Subscription not found'
                    });
                }
                const bagId = subscription.Bag;
                if (!bagId) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 404,
                        message: 'Bag not found in subscription'
                    });
                }
                const frequency = subscription.FrequencyId;
                const totalDeliveries = subscription.TotalDeliveryNumber;
                const dayBasis = frequency.DayBasis;
                const deliveryDates = [];
                const startDate = new Date(DeliveryStartDate);
                for (let i = 0; i < totalDeliveries; i++) {
                    const deliveryDate = new Date(startDate);
                    deliveryDate.setDate(startDate.getDate() + i * dayBasis);
                    deliveryDates.push(deliveryDate);
                }
                const user = yield user_model_1.default.findById(UserId).populate('Address.City');
                if (!user || !user.Address || !user.Address.ZipCode || !user.Address.City) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 404,
                        message: 'User address not found'
                    });
                }
                const locality = yield route_model_1.LocalityModel.findOne({
                    Pin: { $in: [user.Address.ZipCode] },
                    Serviceable: true,
                });
                if (!locality) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 404,
                        message: `Oops's We are not serviceable in your area `
                    });
                }
                const zone = yield route_model_1.ZoneModel.findOne({
                    Localities: locality._id,
                    Serviceable: true,
                });
                if (!zone) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 404,
                        message: 'We are serviceable in this area but no zone include this locality'
                    });
                }
                const route = yield route_model_1.RouteModel.findOne({
                    'ZonesIncluded.ZoneId': zone._id,
                    Status: true,
                });
                if (!route) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 404,
                        message: 'We are serviceable in this area but no route cover this zone'
                    });
                }
                const deliveryPromises = deliveryDates.map((date) => __awaiter(void 0, void 0, void 0, function* () {
                    const delivery = new delivery_model_1.default({
                        OrderId: order._id,
                        UserId,
                        DeliveryDate: date,
                        Status: 'pending',
                        Bag: [{ BagID: bagId, BagWeight: 0 }],
                        AssignedRoute: route._id,
                    });
                    return yield delivery.save();
                }));
                const deliveries = yield Promise.all(deliveryPromises);
                return send_response_1.responseHandler.out(req, res, {
                    status: true,
                    statusCode: 201,
                    message: 'Order created successfully',
                });
            }
            catch (err) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 500,
                    message: 'Failed to create deliveries',
                    data: err.message,
                });
            }
        }
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: error.message,
        });
    }
});
exports.createOrderByAdmin = createOrderByAdmin;
// Get all orders by admin
const getAllOrdersByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        const orders = yield order_model_1.default.find()
            .skip(skip)
            .limit(limit)
            .populate('UserId', 'FirstName LastName Email Phone') // Populate user details
            .populate({
            path: 'SubscriptionId',
            select: 'SubscriptionTypeId FrequencyId', // Select the fields you want
            populate: [
                {
                    path: 'SubscriptionTypeId',
                    select: 'Name', // Populate SubscriptionType name
                },
                {
                    path: 'FrequencyId',
                    select: 'Name', // Populate Frequency name
                },
            ],
        })
            .populate('Coupons', 'Code DiscountPercentage DiscountPrice DiscountType Status') // Populate coupon details if applicable
            .populate('Deliveries') // Populate delivery details if applicable
            .populate('CreatedBy', 'FirstName LastName Email Phone')
            .populate('UpdatedBy', 'FirstName LastName Email Phone');
        const total = yield order_model_1.default.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Orders retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                orders,
            },
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: error.message,
        });
    }
});
exports.getAllOrdersByAdmin = getAllOrdersByAdmin;
// Toggle status of order by admin
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        if (!loggedInId) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Admin not found',
            });
        }
        const OrderId = req.params.id;
        const { Status } = req.body;
        if (!OrderId || Status === undefined) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Order ID and status are required',
            });
        }
        const order = yield order_model_1.default.findById(OrderId);
        if (!order) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Order not found',
            });
        }
        order.Status = Status;
        yield order.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Order status updated successfully',
            data: order,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: error.message,
        });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// Get a single order by ID with full details populated
const getOrderByIdByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        if (!loggedInId) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Admin not found',
            });
        }
        const OrderId = req.params.id;
        if (!OrderId) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Order ID is required',
            });
        }
        const order = yield order_model_1.default.findById({ _id: OrderId })
            .populate({
            path: 'UserId',
            select: '-Otp -OtpExpiry -Password', // Exclude sensitive fields
            populate: {
                path: 'ReferredBy AssignedEmployee Source CustomerType',
                populate: {
                    path: 'CreatedBy UpdatedBy',
                    select: 'FirstName LastName Email PhoneNumber',
                },
            },
        })
            .populate({
            path: 'SubscriptionId',
            select: 'SubscriptionTypeId FrequencyId',
            populate: [
                {
                    path: 'SubscriptionTypeId',
                    select: 'Name',
                },
                {
                    path: 'FrequencyId',
                    select: 'Name',
                },
            ],
        })
            .populate('Coupons', 'Code DiscountPercentage DiscountPrice DiscountType Status')
            .populate('Deliveries')
            .populate('CreatedBy', 'FirstName LastName Email PhoneNumber')
            .populate('UpdatedBy', 'FirstName LastName Email PhoneNumber');
        if (!order) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Order not found',
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Order retrieved successfully',
            data: order,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: error.message,
        });
    }
});
exports.getOrderByIdByAdmin = getOrderByIdByAdmin;
// Get all order for logged in user
const getAllOrdersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        const orders = yield order_model_1.default.find({ UserId: req['userId'] })
            .skip(skip)
            .limit(limit)
            .populate('UserId', 'FirstName LastName Email Phone') // Populate user details
            .populate({
            path: 'SubscriptionId',
            select: 'SubscriptionTypeId FrequencyId', // Select the fields you want
            populate: [
                {
                    path: 'SubscriptionTypeId',
                    select: 'Name', // Populate SubscriptionType name
                },
                {
                    path: 'FrequencyId',
                    select: 'Name', // Populate Frequency name
                },
            ],
        })
            .populate('-Coupons') // Exclude Coupons
            .populate('Deliveries') // Populate delivery details if applicable
            .populate('-CreatedBy') // Exclude CreatedBy
            .populate('-UpdatedBy'); // Exclude UpdatedBy
        const total = yield order_model_1.default.countDocuments({ UserId: req['userId'] });
        const totalPages = Math.ceil(total / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Orders retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                orders,
            },
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: error.message,
        });
    }
});
exports.getAllOrdersByUser = getAllOrdersByUser;
// Apply coupons from user side
const ApplyCouponsFromUserSide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUser = req['userId'];
        const { SubscriptionId, Coupon } = req.body;
        // Validate required fields
        if (!SubscriptionId) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Missing required fields',
            });
        }
        // Declare validCoupon outside to use it later
        let validCoupon;
        // Validate the coupon if provided
        if (Coupon) {
            validCoupon = yield coupons_model_1.default.findById(Coupon);
            if (!validCoupon) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Invalid coupon',
                });
            }
            const currentDate = new Date();
            // Coupon type and usage validation
            if (validCoupon.CouponVisibility === 'Private') {
                // Check if coupon is assigned to the user
                const isCouponAssignedToUser = validCoupon.AssignedTo.some((assigned) => assigned.Users.toString() === loggedInUser.toString() && !assigned.isUsed);
                if (!isCouponAssignedToUser) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: 'Already Claimed',
                    });
                }
                // Check coupon validity period
                if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `Coupon ${validCoupon.Code} is expired`,
                    });
                }
            }
            else if (validCoupon.CouponVisibility === 'Public' || validCoupon.CouponVisibility === 'Admin') {
                // Check if the coupon has been used by the user
                const isCouponUsedByUser = validCoupon.UsedBy.includes(loggedInUser);
                if (isCouponUsedByUser) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `Coupon ${validCoupon.Code} is already claimed`,
                    });
                }
                // Check coupon validity period
                if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
                    return send_response_1.responseHandler.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `Coupon ${validCoupon.Code} is expired`,
                    });
                }
            }
            // Validate that the coupon can be applied to the given subscription
            if (validCoupon.CouponType === 'Subscription' && !validCoupon.Subscriptions.includes(SubscriptionId)) {
                return send_response_1.responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: `Coupon ${validCoupon.Code} is not valid for this subscription`,
                });
            }
        }
        // Respond with the Valid Coupon
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: 'Coupon applied successfully',
            data: {
                DiscountType: validCoupon.DiscountType,
                DiscountPercentage: validCoupon.DiscountPercentage,
                DiscountPrice: validCoupon.DiscountPrice,
            },
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: error.message,
        });
    }
});
exports.ApplyCouponsFromUserSide = ApplyCouponsFromUserSide;
// Get a single order by ID for the logged-in user
const getSingleOrderByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req['userId']; // Assuming userId is set in the request, e.g., by a middleware
        const OrderId = req.params.id;
        if (!OrderId) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Order ID is required',
            });
        }
        const order = yield order_model_1.default.findOne({ _id: OrderId, UserId: userId })
            .populate('UserId', 'FirstName LastName Email Phone') // Populate user details
            .populate({
            path: 'SubscriptionId',
            select: 'SubscriptionTypeId FrequencyId',
            populate: [
                {
                    path: 'SubscriptionTypeId',
                    select: 'Name',
                },
                {
                    path: 'FrequencyId',
                    select: 'Name',
                },
            ],
        })
            .populate('Coupons', 'Code DiscountPercentage DiscountPrice DiscountType Status') // Populate coupon details if applicable
            // .populate('Deliveries') // Populate delivery details if applicable
            .populate('-CreatedBy')
            .populate('-UpdatedBy');
        if (!order) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Order not found',
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Order retrieved successfully',
            data: order,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: error.message,
        });
    }
});
exports.getSingleOrderByUser = getSingleOrderByUser;
