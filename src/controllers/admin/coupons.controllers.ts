import { Request, Response } from 'express';
import CouponModel from '../../models/coupons.model';
import SubscriptionModel from '../../models/subscription.model';
import { responseHandler } from '../../utils/send-response';
import UserModel from '../../models/user.model';


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
      if (CouponType === 'Subscription' && (!Array.isArray(SubscriptionIds) || SubscriptionIds.length < 1)) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: 'SubscriptionIds must be an array with at least one element',
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
        SubscriptionIds, // Should be an array
      } = req.body;
  
      // Validate coupon ID format
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: 'Invalid coupon ID format',
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
  
      // Validate SubscriptionIds if CouponType is 'Subscription'
      if (CouponType === 'Subscription' && (!Array.isArray(SubscriptionIds) || SubscriptionIds.length < 1)) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: 'SubscriptionIds must be an array with at least one element',
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
  
      // Prepare update data
      const updateData: any = {};
      if (CouponType) updateData.CouponType = CouponType;
      if (CouponCategory) updateData.CouponCategory = CouponCategory;
      if (Code) updateData.Code = Code;
      if (DiscountType) updateData.DiscountType = DiscountType;
  
      if (DiscountType === 'Percentage') {
        if (DiscountPercentage !== undefined) updateData.DiscountPercentage = DiscountPercentage;
        updateData.$unset = { DiscountPrice: "" }; // Remove DiscountPrice if the type is Percentage
      } else if (DiscountType === 'FixedAmount') {
        if (DiscountPrice !== undefined) updateData.DiscountPrice = DiscountPrice;
        updateData.$unset = { DiscountPercentage: "" }; // Remove DiscountPercentage if the type is FixedAmount
      }
  
      if (ValidityType) updateData.ValidityType = ValidityType;
      if (StartDate) updateData.StartDate = StartDate;
      if (EndDate) updateData.EndDate = EndDate;
      if (NumberOfTimesCanBeAppliedPerUser !== undefined) updateData.NumberOfTimesCanBeAppliedPerUser = NumberOfTimesCanBeAppliedPerUser;
      if (CouponVisibility) updateData.CouponVisibility = CouponVisibility;
      if (Status) updateData.Status = Status;
      if (Description) updateData.Description = Description;
      if (ImageUrl) updateData.ImageUrl = ImageUrl;
      if (AssignedTo) updateData.AssignedTo = AssignedTo;
      if (AssignedBy) updateData.AssignedBy = AssignedBy;
      if (CouponType === 'Subscription' && SubscriptionIds) updateData.Subscriptions = SubscriptionIds;
  
      if (CouponCategory === "FreeDelivery") {
        // Unset all discount-related fields
        updateData.$unset = {
          DiscountType: "",
          DiscountPercentage: "",
          DiscountPrice: ""
        };
      }
  
      if (CouponType === 'Normal') {
        // Unset Subscriptions if the CouponType is Normal
        updateData.$unset = { ...updateData.$unset, Subscriptions: "" };
      }
  
      // Update coupon in the database
      const coupon = await CouponModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  
      if (!coupon) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 404,
          message: 'Coupon not found',
        });
      }
  
      responseHandler.out(req, res, {
        status: true,
        statusCode: 200,
        message: 'Coupon updated successfully',
        data: coupon,
      });
    } catch (error) {
      console.error('Error updating coupon:', error);
      responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Internal server error',
      });
    }
}

export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid coupon ID format',
            });
        }

        const coupon = await CouponModel.findByIdAndDelete(id);

        if (!coupon) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Coupon not found',
            });
        }

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Coupon deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
};

export const getAllCoupons = async (req: Request, res: Response) => {
  try {
      const currentPage = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (currentPage - 1) * limit;

      // Fetch coupons with pagination
      const coupons = await CouponModel.find().skip(skip).limit(limit)
      .populate({
        path: 'Subscriptions',
        populate: [
            { path: 'SubscriptionTypeId', select: '_id Name' }, // Adjust 'name' to actual field in SubscriptionType model
            { path: 'FrequencyId', select: '_id Name' }, // Adjust 'frequency' to actual field in Frequency model
            { path: 'Bag', select: 'BagName' } // Adjust 'frequency' to actual field in Frequency model
        ]
    })
    .populate({
        path: 'CreatedBy',
        select: 'FirstName LastName Email PhoneNumber' // 
    })
    .populate({
        path: 'UpdatedBy',
        select: 'FirstName LastName Email PhoneNumber' // 
    })
    ;
      const total = await CouponModel.countDocuments();
      const totalPages = Math.ceil(total / limit);

      const prevPage = currentPage > 1;
      const nextPage = currentPage < totalPages;

      // Standardize response
      responseHandler.out(req, res, {
          status: true,
          statusCode: 200,
          message:"Coupons retrieved successfully",
          data: {
              total,
              currentPage,
              totalPages,
              prevPage,
              nextPage,
              coupons,
          },
      });
  } catch (error) {
      responseHandler.out(req, res, {
          status: false,
          statusCode: 500,
          message: 'Internal server error',
      });
  }
};

export const getCouponById = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;

      // Validate ID format
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 400,
              message: 'Invalid coupon ID format',
          });
      }

      // Fetch coupon by ID
      const coupon = await CouponModel.findById(id)
      .populate({
          path: 'Subscriptions',
          populate: [
              { path: 'SubscriptionTypeId', select: '_id Name' }, // Adjust 'name' to actual field in SubscriptionType model
              { path: 'FrequencyId', select: '_id Name' }, // Adjust 'frequency' to actual field in Frequency model
              { path: 'Bag', select: 'BagName' } // Adjust 'frequency' to actual field in Frequency model
          ]
      })
      .populate({
          path: 'CreatedBy',
          select: 'FirstName LastName Email PhoneNumber' // 
      })
      .populate({
          path: 'UpdatedBy',
          select: 'FirstName LastName Email PhoneNumber' // 
      })
      ;
      // Check if coupon exists
      if (!coupon) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: 'Coupon not found',
          });
      }

      // Standardize response
      responseHandler.out(req, res, {
          status: true,
          message:"Coupon retrieved successfully",

          statusCode: 200,
          data: coupon,
      });
  } catch (error) {
      console.error('Error retrieving coupon:', error);
      responseHandler.out(req, res, {
          status: false,
          statusCode: 500,
          message: 'Internal server error',
      });
  }
};

export const updateCouponStatus = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;
      const { Status } = req.body;

      // Validate ID format
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 400,
              message: 'Invalid coupon ID format',
          });
      }

      // Validate status
      const validStatuses = ['Active', 'Inactive'];
      if (!validStatuses.includes(Status)) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 400,
              message: 'Status must be either "Active" or "Inactive"',
          });
      }

      // Update the coupon status
      const coupon = await CouponModel.findByIdAndUpdate(id, { Status }, { new: true, runValidators: true });

      if (!coupon) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: 'Coupon not found',
          });
      }

      responseHandler.out(req, res, {
          status: true,
          statusCode: 200,
          message: 'Coupon status updated successfully',
          data: coupon,
      });
  } catch (error) {
      console.error('Error updating coupon status:', error);
      responseHandler.out(req, res, {
          status: false,
          statusCode: 500,
          message: 'Internal server error',
      });
  }
};


export const AssignCouponsToCustomer = async (req: Request, res: Response) => {
  try {
    const { UserIds } = req.body;
    const CouponId = req.params.id;

    // Validate required fields
    if (!CouponId || !UserIds || !Array.isArray(UserIds) || UserIds.length === 0) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Missing required fields: couponId and userIds',
      });
    }

    // Find the coupon by ID
    const coupon = await CouponModel.findById(CouponId);
    if (!coupon) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'Coupon not found',
      });
    }

    if (coupon.CouponVisibility !== "Private") {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Admin or Public Coupons Cannot Be Assigned',
      });
    }

    // Ensure AssignedTo is initialized as an array
    if (!Array.isArray(coupon.AssignedTo)) {
      coupon.AssignedTo = [];
    }

    // Identify user IDs that are already assigned
    const alreadyAssignedUserIds = coupon.AssignedTo.map(assigned => assigned.Users.toString());

    const newUserIds = UserIds.filter(userId => !alreadyAssignedUserIds.includes(userId));

    // If no new users to assign, return a message with names
    if (newUserIds.length === 0) {
      const alreadyAssignedUsers = await UserModel.find({ _id: { $in: alreadyAssignedUserIds } });
      const alreadyAssignedUserNames = alreadyAssignedUsers.map(user => user.FirstName);
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: `The following users already have the coupon assigned: ${alreadyAssignedUserNames.join(', ')}`,
      });
    }

    // Construct new assignments without changing the schema structure
    const newAssignments = newUserIds.map(userId => ({
      Users: userId,  // Directly use the userId
      isUsed: false,  // Set default value for isUsed
    }));

    // Update the coupon document by pushing new assignments
    await CouponModel.updateOne(
      { _id: CouponId },
      { $push: { AssignedTo: { $each: newAssignments } } }  // Use $push with $each to add multiple entries
    );

    // Fetch the updated coupon
    const updatedCoupon = await CouponModel.findById(CouponId);

    responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Coupon assigned to users successfully',
      data: updatedCoupon,
    });
  } catch (error) {
    console.error('Error assigning coupon to users:', error);
    responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
    });
  }
};

