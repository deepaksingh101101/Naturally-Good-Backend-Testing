import { Request, Response } from 'express';
import SubscriptionModel from '../../models/subscription.model';
import CouponModel from '../../models/coupons.model';
import OrderModel, { AllPaymentStatus, AllPaymentType } from '../../models/order.model';
import UserModel from '../../models/user.model';

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
        } else if (validCoupon.CouponVisibility === 'Public') {
          // Check if the coupon has been used by the user
          const isCouponUsedByUser = validCoupon.usedBy.includes(UserId);
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
  
      // If coupon is valid and public, mark it as used by the user
      if (Coupon && validCoupon && validCoupon.CouponVisibility === 'Public') {
        validCoupon.usedBy.push(UserId);
        await validCoupon.save();
      }
  
      // If coupon is valid and private, mark it as used for the user
      if (Coupon && validCoupon && validCoupon.CouponVisibility === 'Private') {
        const userCoupon = validCoupon.AssignedTo.find((assigned) => assigned.Users.toString() === UserId.toString());
        if (userCoupon) {
          userCoupon.isUsed = true;
          await validCoupon.save();
        }
      }
  
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
      });
  
      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };
  
  
  