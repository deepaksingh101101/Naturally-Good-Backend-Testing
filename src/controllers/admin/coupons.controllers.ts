import { Request, Response } from 'express';
import CouponModel from '../../models/coupons.model';
import SubscriptionModel from '../../models/subscription.model';
import { responseHandler } from '../../utils/send-response';


export const createCoupon = async (req: Request, res: Response) => {
    try {
      const loggedInId = req['decodedToken']?.id;
      const {
        CouponType,
        CouponCategory,
        Code,
        DiscountType,
        DiscountPercentage,
        DiscountPrice,
        ValidityType,
        StartDate,
        EndDate,
        NumberOfTimesCanBeAppliedPerUser,
        CouponVisibility,
        Status,
        Description,
        ImageUrl,
        AssignedTo,
        AssignedBy,
        SubscriptionIds, // Changed from SubscriptionId to SubscriptionIds to reflect an array
      } = req.body;
  
      // Check if all required fields are present
      if (!CouponType || !CouponCategory || !Code || !DiscountType || !ValidityType || !CouponVisibility || !Status) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: 'Missing required fields',
        });
      }
      // Conditional validation based on DiscountType
      if (DiscountType === 'Percentage' && DiscountPercentage == null) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: 'DiscountPercentage is required when DiscountType is Percentage',
        });
      }
  
      if (DiscountType === 'FixedAmount' && DiscountPrice == null) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: 'DiscountPrice is required when DiscountType is FixedAmount',
        });
      }
      // Conditional validation based on ValidityType
      if (ValidityType === 'DateRange') {
        if (!StartDate || !EndDate) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'StartDate and EndDate are required when ValidityType is DateRange',
          });
        }
      } 
      if (CouponCategory !== 'FreeDelivery' && (DiscountType==null )) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: 'Discount Type is required when Coupons Category is not freeDelivery',
        });
      }

      // Check if the coupon code already exists (case insensitive)
      const existingCoupon = await CouponModel.findOne({
        Code: { $regex: new RegExp(`^${Code}$`, 'i') },
      });
      if (existingCoupon) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: 'Coupon code already exists',
        });
      }
  
      // Check if the referenced Subscriptions exist if CouponType is 'Subscription'
      if (CouponType === 'Subscription' && Array.isArray(SubscriptionIds) && SubscriptionIds.length > 0) {
        const subscriptions = await SubscriptionModel.find({ _id: { $in: SubscriptionIds } });
        if (subscriptions.length !== SubscriptionIds.length) {
          return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'Invalid Subscription ID(s)',
          });
        }
      }
  
      // Create a new Coupon instance
      const coupon = new CouponModel({
        CouponType,
        Code,
        DiscountType,
        DiscountPercentage,
        DiscountPrice,
        ValidityType,
        StartDate,
        EndDate,
        NumberOfTimesCanBeAppliedPerUser,
        CouponVisibility,
        Status,
        Description,
        CouponCategory,
        ImageUrl,
        AssignedTo,
        AssignedBy,
        CreatedBy: loggedInId,
        UpdatedBy: loggedInId,
        Subscriptions: CouponType === 'Subscription' ? SubscriptionIds : [],
      });
  
      const savedCoupon = await coupon.save();
  
      // If CouponType is 'Subscription' and status is active, update the Subscriptions with the new coupon ID
      if (CouponType === 'Subscription' && Status === 'Active' && Array.isArray(SubscriptionIds) && SubscriptionIds.length > 0) {
        await SubscriptionModel.updateMany(
          { _id: { $in: SubscriptionIds } },
          { $push: { Coupons: savedCoupon._id } }
        );
      }
  
      return responseHandler.out(req, res, {
        status: true,
        statusCode: 201,
        message: 'Coupon created successfully',
        data: savedCoupon,
      });
    } catch (error) {
      console.error('Error creating coupon:', error); // Improved error logging
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal server error',
        data: error.message, // Optionally, provide the error message
      });
    }
  };
  
export const updateCoupon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            CouponType,
            SubscriptionId,
            CouponCode,
            DiscountPrice,
            CouponStartDate,
            CouponEndDate,
            CouponVisibility,
            Status,
            Description,
            ImageUrl
        } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid coupon ID format' });
        }

        // Check if the referenced Subscriptions exist if CouponType is 'SubscriptionBasis'
        if (CouponType === 'SubscriptionBasis' && Array.isArray(SubscriptionId) && SubscriptionId.length > 0) {
            const subscriptions = await SubscriptionModel.find({ _id: { $in: SubscriptionId } });
            if (subscriptions.length !== SubscriptionId.length) {
                return res.status(400).json({ error: 'Invalid Subscription ID(s)' });
            }
        }

        const coupon = await CouponModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedAt: new Date().toISOString() },
            { new: true, runValidators: true }
        );

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        // If CouponType is 'SubscriptionBasis' and status is active, update the Subscriptions with the new coupon ID
        if (CouponType === 'SubscriptionBasis' && Status === 'Active' && Array.isArray(SubscriptionId) && SubscriptionId.length > 0) {
            await SubscriptionModel.updateMany(
                { _id: { $in: SubscriptionId } },
                { $addToSet: { Coupons: coupon._id } }
            );
        }

        // If CouponType is 'SubscriptionBasis' and status is inactive, remove the coupon ID from the Subscriptions
        if (CouponType === 'SubscriptionBasis' && Status === 'Inactive' && Array.isArray(SubscriptionId) && SubscriptionId.length > 0) {
            await SubscriptionModel.updateMany(
                { _id: { $in: SubscriptionId } },
                { $pull: { Coupons: coupon._id } }
            );
        }

        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid coupon ID format' });
        }

        const coupon = await CouponModel.findByIdAndDelete(id);

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        // Remove the coupon reference from subscriptions only if the status is active
        if (coupon.Status === 'Active') {
            await SubscriptionModel.updateMany(
                { Coupons: coupon._id },
                { $pull: { Coupons: coupon._id } }
            );
        }

        res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status (500).json({ error: 'Internal server error' });
    }
};


export const getAllCoupons = async (req: Request, res: Response) => {
    try {
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        const coupons = await CouponModel.find().skip(skip).limit(limit);
        const total = await CouponModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        res.status(200).json({
            total,
            currentPage,
            totalPages,
            prevPage,
            nextPage,
            coupons
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getCouponById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid coupon ID format' });
        }

        const coupon = await CouponModel.findById(id);

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
