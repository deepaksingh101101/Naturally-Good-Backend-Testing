import { Request, Response } from 'express';
import CouponModel from '../../models/coupons.model';
import OrderModel, { AllPaymentStatus, AllPaymentType } from '../../models/order.model';
import SubscriptionModel from '../../models/subscription.model';
import { responseHandler } from '../../utils/send-response';

// Create order by admin
export const createOrderByAdmin = async (req: Request, res: Response) => {
    try {
      const {
        UserId,
        SubscriptionId,
        NetPrice,
        Coupon,
        ManualDiscountPercentage,
        AmountReceived,
        BookingDate,
        DeliveryStartDate,
        PaymentStatus,
        PaymentType,
        SpecialInstruction,
        PaymentDate,
      } = req.body;
  
      const loggedInId = req['decodedToken']?.id;
  
      // Validate required fields
      if (!UserId || !SubscriptionId || !NetPrice || !BookingDate || !DeliveryStartDate || !PaymentStatus || !PaymentType) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      if (PaymentType !== 'cash' && !PaymentDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Declare validCoupon outside to use it later
      let validCoupon: any;
  
      // Validate the coupon if provided
      if (Coupon) {
        validCoupon = await CouponModel.findById(Coupon);
        if (!validCoupon) {
          return res.status(404).json({ error: 'Invalid coupon' });
        }
  
        const currentDate = new Date();
  
        // Coupon type and usage validation
        if (validCoupon.CouponVisibility === 'Private') {
          // Check if coupon is assigned to the user
          const isCouponAssignedToUser = validCoupon.AssignedTo.some(
            (assigned) => assigned.Users.toString() === UserId.toString() && !assigned.isUsed
          );
  
          if (!isCouponAssignedToUser) {
            return res.status(400).json({ error: `Coupon ${validCoupon.Code} is not assigned or already used by the user` });
          }
  
          // Check coupon validity period
          if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
            return res.status(400).json({ error: `Coupon ${validCoupon.Code} is expired` });
          }
        } else if (validCoupon.CouponVisibility === 'Public'||'Admin') {
          // Check if the coupon has been used by the user
          const isCouponUsedByUser = validCoupon.UsedBy.includes(UserId);
          if (isCouponUsedByUser) {
            return res.status(400).json({ error: `Coupon ${validCoupon.Code} is already used by the user` });
          }
  
          // Check coupon validity period
          if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
            return res.status(400).json({ error: `Coupon ${validCoupon.Code} is expired` });
          }
        }
  
        // Validate that the coupon can be applied to the given subscription
        if (validCoupon.CouponType === 'Subscription' && !validCoupon.Subscriptions.includes(SubscriptionId)) {
          return res.status(400).json({ error: `Coupon ${validCoupon.Code} is not valid for the given subscription` });
        }
      }
  
      // Calculate amount due
      const amountDue = NetPrice - AmountReceived;
  
      // Create new order
      const order = new OrderModel({
        UserId: UserId,
        SubscriptionId: SubscriptionId,
        NetPrice: NetPrice,
        Coupons: Coupon, // Store the single coupon
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
  
      // Save the order to the database
      const isOrderCreated = await order.save();
  
      if (isOrderCreated && Coupon) {

        if (validCoupon.CouponVisibility === 'Public'||'Admin') {
            validCoupon.UsedBy.push(UserId);
            await validCoupon.save();
          }
        // If coupon is valid and private, mark it as used for the user
        if (validCoupon.CouponVisibility === 'Private') {
          const userCoupon = validCoupon.AssignedTo.find((assigned) => assigned.Users.toString() === UserId.toString());
          if (userCoupon) {
            userCoupon.isUsed = true;
            await validCoupon.save();
          }
        }
        // Update the revenue generated for the coupon
        validCoupon.RevenueGenerated += NetPrice;
        await validCoupon.save();

        // Creating automatic Delivery  according to purchased subscription

    //   const purchasedSubscription= SubscriptionModel.findById(SubscriptionId)
    //   .populate('SubscriptionTypeId')
    //   .populate('FrequencyId')




      }
  
      // Respond with the created order
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };

// Get all orders by admin
export const getAllOrdersByAdmin = async (req: Request, res: Response) => {
    try {
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        const orders = await OrderModel.find()
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
            .populate('Coupons','Code DiscountPercentage DiscountPrice DiscountType Status') // Populate coupon details if applicable
            .populate('Deliveries') // Populate delivery details if applicable
            .populate('CreatedBy', 'FirstName LastName Email Phone') 
            .populate('UpdatedBy', 'FirstName LastName Email Phone') 
        const total = await OrderModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        res.status(200).json({
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
            }
        });
    } catch (error) {
       return res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Toggle status of order by admin
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {

      const loggedInId = req['decodedToken']?.id;

      if(!loggedInId){
        return res.status(400).json({
          status: false,
          statusCode: 400,
          message: 'Admin not found',
      });
      }
      const OrderId=req.params.id
        const {Status } = req.body;

        if (!OrderId || Status === undefined) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Order ID and status are required',
            });
        }

        const order = await OrderModel.findById(OrderId);

        if (!order) {
            return res.status(404).json({
                status: false,
                statusCode: 404,
                message: 'Order not found',
            });
        }

        order.Status = Status;
        await order.save();

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Order status updated successfully',
            order,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            details: error.message,
        });
    }
};

// Get a single order by ID with full details populated
export const getOrderByIdByAdmin = async (req: Request, res: Response) => {
    try {
        const loggedInId = req['decodedToken']?.id;
        if (!loggedInId) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Admin not found',
            });
        }

        const OrderId  = req.params.id;

        if (!OrderId) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Order ID is required',
            });
        }

        const order = await OrderModel.findById({_id:OrderId})
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
            return res.status(404).json({
                status: false,
                statusCode: 404,
                message: 'Order not found',
            });
        }

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Order retrieved successfully',
            order,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            details: error.message,
        });
    }
};

// Get all order for logged in user
export const getAllOrdersByUser = async (req: Request, res: Response) => {
    try {
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        const orders = await OrderModel.find({UserId:req['userId']})
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
            .populate('-Coupons') // Populate coupon details if applicable
            .populate('Deliveries') // Populate delivery details if applicable
            .populate('-CreatedBy') 
            .populate('-UpdatedBy') 
        const total = await OrderModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        res.status(200).json({
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
            }
        });
    } catch (error) {
       return res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            details: error.message
        });
    }
};

// Apply coupons from user side
export const ApplyCouponsFromUserSide = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req['userId'];
    const {
      SubscriptionId,
      Coupon,
    } = req.body;
    
    // Validate required fields
    if (!SubscriptionId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Missing required fields'
      });
    }

    // Declare validCoupon outside to use it later
    let validCoupon: any;

    // Validate the coupon if provided
    if (Coupon) {
      validCoupon = await CouponModel.findById(Coupon);
      if (!validCoupon) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 404,
          message: 'Invalid coupon'
        });
      }

      const currentDate = new Date();

      // Coupon type and usage validation
      if (validCoupon.CouponVisibility === 'Private') {
        // Check if coupon is assigned to the user
        const isCouponAssignedToUser = validCoupon.AssignedTo.some(
          (assigned) => assigned.Users.toString() === loggedInUser.toString() && !assigned.isUsed
        );

        if (!isCouponAssignedToUser) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'Already Claimed'
          });
        }

        // Check coupon validity period
        if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: `Coupon ${validCoupon.Code} is expired`
          });
        }
      } else if (validCoupon.CouponVisibility === 'Public' || validCoupon.CouponVisibility === 'Admin') {
        // Check if the coupon has been used by the user
        const isCouponUsedByUser = validCoupon.UsedBy.includes(loggedInUser);
        if (isCouponUsedByUser) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: `Coupon ${validCoupon.Code} is already claimed`
          });
        }

        // Check coupon validity period
        if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: `Coupon ${validCoupon.Code} is expired`
          });
        }
      }

      // Validate that the coupon can be applied to the given subscription
      if (validCoupon.CouponType === 'Subscription' && !validCoupon.Subscriptions.includes(SubscriptionId)) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: `Coupon ${validCoupon.Code} is not valid for this subscription`
        });
      }
    }

    // Respond with the Valid Coupon
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 201,
      message: 'Coupon applied successfully',
      data: {
        DiscountType: validCoupon.DiscountType,
        DiscountPercentage: validCoupon.DiscountPercentage,
        DiscountPrice: validCoupon.DiscountPrice,
      }
    });

  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message
    });
  }
};

// Get a single order by ID for the logged-in user
export const getSingleOrderByUser = async (req: Request, res: Response) => {
    try {
        const userId = req['userId']; // Assuming userId is set in the request, e.g., by a middleware
        const  OrderId  = req.params.id;

        if (!OrderId) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Order ID is required',
            });
        }

        const order = await OrderModel.findOne({ _id: OrderId, UserId: userId })
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
            return res.status(404).json({
                status: false,
                statusCode: 404,
                message: 'Order not found',
            });
        }

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Order retrieved successfully',
            order,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            details: error.message,
        });
    }
};

