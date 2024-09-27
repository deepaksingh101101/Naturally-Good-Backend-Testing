import { Request, Response } from 'express';
import CouponModel from '../../models/coupons.model';
import OrderModel from '../../models/order.model';
import SubscriptionModel from '../../models/subscription.model';
import { responseHandler } from '../../utils/send-response';
import DeliveryModel from '../../models/delivery.model';
import { FrequencyType } from '../../models/dropdown.model';
import { Bag } from '../../models/bag.model';
import { Ref } from '@typegoose/typegoose';
import { LocalityModel, RouteModel, ZoneModel } from '../../models/route.model';
import UserModel from '../../models/user.model';

// Create order by admin
export const createOrderByAdmin = async (req: Request, res: Response) => {
  try {
    const {
      UserId,
      SubscriptionId,
      NetPrice,
      Coupons,
      ManualDiscountPercentage,
      AmountReceived,
      BookingDate,
      DeliveryStartDate,
      PaymentStatus,
      PaymentType,
      SpecialInstruction,
      PaymentDate,
      Status,
    } = req.body;

    const loggedInId = req['decodedToken']?.id;

    if (!UserId || !SubscriptionId || !NetPrice || !BookingDate || !DeliveryStartDate || !PaymentStatus || !PaymentType) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Missing required fields'
      });
    }
    if (PaymentType !== 'cash' && !PaymentDate) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Missing required fields'
      });
    }

    let validCoupon: any;

    if (Coupons) {
      validCoupon = await CouponModel.findById(Coupons);
      if (!validCoupon) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 404,
          message: 'Invalid coupon'
        });
      }

      const currentDate = new Date();

      if (validCoupon.CouponVisibility === 'Private') {
        const isCouponAssignedToUser = validCoupon.AssignedTo.some(
          (assigned) => assigned.Users.toString() === UserId.toString() && !assigned.isUsed
        );

        if (!isCouponAssignedToUser) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 403,
            message: `Coupon ${validCoupon.Code} is not assigned or already used by the user`
          });
        }

        if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 403,
            message: `Coupon ${validCoupon.Code} is expired`
          });
        }
      } else if (validCoupon.CouponVisibility === 'Public' || 'Admin') {
        const isCouponUsedByUser = validCoupon.UsedBy.includes(UserId);
        if (isCouponUsedByUser) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 403,
            message: `Coupon ${validCoupon.Code} is already used by the user`
          });
        }

        if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 403,
            message: `Coupon ${validCoupon.Code} is expired`
          });
        }
      }

      if (validCoupon.CouponType === 'Subscription' && !validCoupon.Subscriptions.includes(SubscriptionId)) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 403,
          message: `Coupon ${validCoupon.Code} is not valid for the given subscription`
        });
      }
    }
    const amountDue = NetPrice - AmountReceived;
    const order = new OrderModel({
      UserId: UserId,
      SubscriptionId: SubscriptionId,
      NetPrice: NetPrice,
      Coupons: Coupons,
      ManualDiscountPercentage: ManualDiscountPercentage,
      AmountReceived: AmountReceived,
      AmountDue: amountDue,
      BookingDate: new Date(BookingDate),
      DeliveryStartDate: new Date(DeliveryStartDate),
      PaymentDate: new Date(PaymentDate),
      PaymentStatus: PaymentStatus,
      PaymentType: PaymentType,
      SpecialInstruction: SpecialInstruction,
      CreatedBy: loggedInId,
      UpdatedBy: loggedInId,
      Status: Status,
    });

    let isOrderCreated ;
      isOrderCreated=await order.save(); // Save the order
 
      if (isOrderCreated && Coupons) {
        validCoupon.UsedBy.push(UserId);
        await validCoupon.save();
      
        validCoupon.RevenueGenerated = NetPrice+validCoupon?.RevenueGenerated;
        await validCoupon.save();
    }

    if (isOrderCreated) {
      try {
        const subscription = await SubscriptionModel.findById(SubscriptionId)
          .populate<{ FrequencyId: FrequencyType }>('FrequencyId')
          .populate<{ Bag: Bag }>('Bag');

        if (!subscription) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 404,
            message: 'Subscription not found'
          });
        }

        const bagId = subscription.Bag as Ref<Bag>;

        if (!bagId) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 404,
            message: 'Bag not found in subscription'
          });
        }

        const frequency = subscription.FrequencyId as FrequencyType;
        const totalDeliveries = subscription.TotalDeliveryNumber;
        const dayBasis = frequency.DayBasis;

        const deliveryDates = [];
        const startDate = new Date(DeliveryStartDate);
        for (let i = 0; i < totalDeliveries; i++) {
          const deliveryDate = new Date(startDate);
          deliveryDate.setDate(startDate.getDate() + i * dayBasis);
          deliveryDates.push(deliveryDate);
        }

        const user = await UserModel.findById(UserId).populate('Address.City');
        if (!user || !user.Address || !user.Address.ZipCode || !user.Address.City) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 404,
            message: 'User address not found'
          });
        }

        const locality = await LocalityModel.findOne({
          Pin: { $in: [user.Address.ZipCode] },
          Serviceable: true,
        });

        if (!locality) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 404,
            message: `Oops's We are not serviceable in your area `
          });
        }

        const zone = await ZoneModel.findOne({
          Localities: locality._id,
          Serviceable: true,
        });

        if (!zone) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 404,
            message: 'We are serviceable in this area but no zone include this locality'
          });
        }

        const route = await RouteModel.findOne({
          'ZonesIncluded.ZoneId': zone._id,
          Status: true,
        });

        if (!route) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 404,
            message: 'We are serviceable in this area but no route cover this zone'
          });
        }

        const deliveryPromises = deliveryDates.map(async (date) => {
          const delivery = new DeliveryModel({
            OrderId: order._id,
            UserId,
            DeliveryDate: date,
            Status: 'pending',
            Bag: [{ BagID: bagId, BagWeight: 0 }],
            AssignedRoute: route._id,
          });
          return await delivery.save();
        });

        const deliveries = await Promise.all(deliveryPromises);

        // Extract delivery IDs from the saved deliveries
const deliveryIds = deliveries.map((delivery) => delivery._id);

// Update the order with the list of delivery IDs
await OrderModel.findByIdAndUpdate(order._id, {
  $set: { Deliveries: deliveryIds },
});
        return responseHandler.out(req, res, {
          status: true,
          statusCode: 201,
          message: 'Order created successfully',
        });
      } catch (err) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 500,
          message: 'Failed to create deliveries',
          data: err.message,
        });
      }
    }
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};

// Get all orders by admin
export const getAllOrdersByAdmin = async (req: Request, res: Response) => {
  try {
    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (currentPage - 1) * limit;

    const now = new Date(); // Current date

    const orders = await OrderModel.find()
        .skip(skip)
        .limit(limit)
        .populate('UserId', 'FirstName LastName Email Phone') // Populate user details
        .populate({
            path: 'SubscriptionId',
            select: 'SubscriptionTypeId FrequencyId Bag',
            populate: [
                {
                    path: 'SubscriptionTypeId',
                    select: 'Name',
                },
                {
                    path: 'FrequencyId',
                    select: 'Name',
                },
                {
                    path: 'Bag',
                    select: 'BagName BagMaxWeight',
                },
            ],
        })
        .populate('Coupons', 'Code DiscountPercentage DiscountPrice DiscountType Status') // Populate coupon details
        .populate({
            path: 'Deliveries',
            match: { DeliveryDate: { $gte: now } }, // Match upcoming deliveries
            options: { limit: 4 }, // Limit to the next 4 upcoming deliveries
            select: 'Name AssignedRoute DeliveryDate Status DeliveryTime', // Select the fields you want
            populate: {
                path: 'AssignedRoute',
                select: 'RouteName',
            },
        })
        .populate('CreatedBy', 'FirstName LastName Email Phone')
        .populate('UpdatedBy', 'FirstName LastName Email Phone');
    
    const total = await OrderModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const prevPage = currentPage > 1;
    const nextPage = currentPage < totalPages;

    responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data:{
        total,
        currentPage,
        totalPages,
        prevPage,
        nextPage,
        orders,
      },
    });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};

// Toggle status of order by admin
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const loggedInId = req['decodedToken']?.id;

    if (!loggedInId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Admin not found',
      });
    }

    const OrderId = req.params.id;
    const { Status } = req.body;

    if (!OrderId || Status === undefined) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Order ID and status are required',
      });
    }

    const order = await OrderModel.findById(OrderId);

    if (!order) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'Order not found',
      });
    }

    order.Status = Status;
    await order.save();

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Order status updated successfully',
      data: order ,
    });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};

// Get a single order by ID with full details populated
export const getOrderByIdByAdmin = async (req: Request, res: Response) => {
  try {
    const loggedInId = req['decodedToken']?.id;
    if (!loggedInId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Admin not found',
      });
    }

    const OrderId = req.params.id;

    if (!OrderId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Order ID is required',
      });
    }

    const order = await OrderModel.findById({ _id: OrderId })
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
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'Order not found',
      });
    }

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Order retrieved successfully',
      data:  order ,
    });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};

// Get all order for logged in user
export const getAllOrdersByUser = async (req: Request, res: Response) => {
  try {
    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (currentPage - 1) * limit;

    const orders = await OrderModel.find({ UserId: req['userId'] })
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

    const total = await OrderModel.countDocuments({ UserId: req['userId'] });
    const totalPages = Math.ceil(total / limit);

    const prevPage = currentPage > 1;
    const nextPage = currentPage < totalPages;

    responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data:{
        total,
        currentPage,
        totalPages,
        prevPage,
        nextPage,
        orders,
      },
    });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};

// Apply coupons from user side
export const ApplyCouponsFromUserSide = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req['userId'];
    const { SubscriptionId, Coupon } = req.body;

    // Validate required fields
    if (!SubscriptionId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Missing required fields',
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
          message: 'Invalid coupon',
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
            message: 'Already Claimed',
          });
        }

        // Check coupon validity period
        if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: `Coupon ${validCoupon.Code} is expired`,
          });
        }
      } else if (validCoupon.CouponVisibility === 'Public' || validCoupon.CouponVisibility === 'Admin') {
        // Check if the coupon has been used by the user
        const isCouponUsedByUser = validCoupon.UsedBy.includes(loggedInUser);
        if (isCouponUsedByUser) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: `Coupon ${validCoupon.Code} is already claimed`,
          });
        }

        // Check coupon validity period
        if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: `Coupon ${validCoupon.Code} is expired`,
          });
        }
      }

      // Validate that the coupon can be applied to the given subscription
      if (validCoupon.CouponType === 'Subscription' && !validCoupon.Subscriptions.includes(SubscriptionId)) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: `Coupon ${validCoupon.Code} is not valid for this subscription`,
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
      },
    });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};

// Get a single order by ID for the logged-in user
export const getSingleOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = req['userId']; // Assuming userId is set in the request, e.g., by a middleware
    const OrderId = req.params.id;

    if (!OrderId) {
      return responseHandler.out(req, res, {
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
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'Order not found',
      });
    }

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Order retrieved successfully',
      data: order ,
    });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};




// get delivery charge for order by userid
export const getDeliveryChargeByUserId = async (req: Request, res: Response) => {
  try {

    const UserId = req.params.id;

    if (!UserId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'User ID is required',
      });
    }

    const user=await UserModel.findById(UserId)

    if (!user) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'User not found',
      });
    }


    const isLocalityExist = await LocalityModel.findOne({ Pin: user?.Address?.ZipCode });

    if (!isLocalityExist) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'Locality not found for this user.',
      });
    }
    
    // Now check if this locality exists in any Zone's Localities array
    const isZoneExist = await ZoneModel.findOne({ Localities: isLocalityExist._id });
    
    if (!isZoneExist) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'No zone found with this locality.',
      });
    }

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: `Zone Delivery charge ${isZoneExist?.DeliveryCost}`,
      data:  isZoneExist?.DeliveryCost ,

    });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};