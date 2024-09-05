import { Request, Response } from 'express';
import SubscriptionModel from '../../models/subscription.model';
import CouponModel from '../../models/coupons.model';
import OrderModel from '../../models/order.model';
import UserModel from '../../models/user.model';

// export const createOrderByAdmin = async (req: Request, res: Response) => {
//     try {
//         const {
//             UserId,
//             SubscriptionId,
//             NetPrice,
//             Coupon,
//             ManualDiscountPercentage,
//             AmountReceived,
//             BookingDate,
//             DeliveryStartDate,
//             PaymentStatus,
//             PaymentType,
//             SpecialInstruction,
//             PaymentDate,
//         } = req.body;

//         const loggedInId = req['decodedToken']?.id;

//         // Validate required fields
//         if (!UserId || !SubscriptionId || !NetPrice || !BookingDate || !DeliveryStartDate || !PaymentStatus || !PaymentType) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }
//         if (PaymentType !== 'cash' && !PaymentDate) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Validate the coupon if provided
//         if (Coupon) {
//             const validCoupon = await CouponModel.findById(Coupon);
//             if (!validCoupon) {
//                 return res.status(404).json({ error: 'Invalid coupon' });
//             }

//             if (validCoupon.CouponType === 'Subscription') {
//                 if (!validCoupon.Subscriptions.includes(SubscriptionId)) {
//                     return res.status(400).json({ error: `Coupon ${validCoupon.Code} is not valid for the given subscription` });
//                 }
//             }
//             // Check coupon visibility and validity
//             const user = await UserModel.findById(UserId).populate('Coupons.Coupon');
//             const currentDate = new Date();

//             if (validCoupon.CouponVisibility === 'Private') {
//                 // Check if user's coupon exists and is not used or expired
//                 const userCoupon = user.Coupons.find(userCoupon => userCoupon.Coupon.toString() === validCoupon._id.toString());
//                 if (!userCoupon) {
//                     return res.status(400).json({ error: `Coupon ${validCoupon.Code} is not valid for the user` });
//                 }
//                 if (userCoupon.usedTimes >= validCoupon.NumberOfTimesCanBeAppliedPerUser) {
//                     return res.status(400).json({ error: `Coupon ${validCoupon.Code} is already used` });
//                 }
//                 if (currentDate < validCoupon.StartDate || currentDate > validCoupon.EndDate) {
//                     return res.status(400).json({ error: `Coupon ${validCoupon.Code} is expired` });
//                 }
//             } 
//         }

//         // Validate payment status
//         if (!Object.values(PaymentStatus).includes(PaymentStatus)) {
//             return res.status(400).json({ error: 'Invalid payment status' });
//         }

//         // Validate payment type
//         if (!Object.values(PaymentType).includes(PaymentType)) {
//             return res.status(400).json({ error: 'Invalid payment type' });
//         }

//         // Calculate amount due
//         const amountDue = NetPrice - AmountReceived;

//         UserModel.findByIdAndUpdate(UserId,Coupons)
//         // Create new order
//         const order = new OrderModel({
//             UserId: UserId,
//             SubscriptionId: SubscriptionId,
//             NetPrice: NetPrice,
//             Coupons: Coupon, // Store the single coupon
//             ManualDiscountPercentage: ManualDiscountPercentage,
//             AmountReceived: AmountReceived,
//             AmountDue: amountDue,
//             BookingDate: new Date(BookingDate),
//             DeliveryStartDate: new Date(DeliveryStartDate),
//             PaymentStatus: PaymentStatus,
//             PaymentType: PaymentType,
//             SpecialInstruction: SpecialInstruction,
//             CreatedBy: loggedInId,
//         });

//         await order.save();
//         res.status(201).json(order);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error', details: error.message });
//     }
// };