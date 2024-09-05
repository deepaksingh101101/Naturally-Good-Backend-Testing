import { Request, Response } from 'express';
import CouponModel from '../../models/coupons.model';
import OrderModel, { AllPaymentStatus, AllPaymentType } from '../../models/order.model';
import SubscriptionModel from '../../models/subscription.model';

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