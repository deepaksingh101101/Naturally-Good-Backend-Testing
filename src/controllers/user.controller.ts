import { Request, Response } from 'express';
import { client, twilioNumber } from '../../twilio';
import FeedbackModel from '../models/feedback.model';
import UserModel from '../models/user.model';
import { BagModel } from '../models/bag.model';
import { responseHandler } from '../utils/send-response';
import jwt from 'jsonwebtoken';
// import { OAuth2Client } from 'google-auth-library';

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '525557668529-0sv0893s4r5b5gqrh82d3f6ffqgsrg4e.apps.googleusercontent.com');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


export const sendOTP = async (req: Request, res: Response) => {
  try {
    let { PhoneNo } = req.body;
    if (!PhoneNo) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Phone number is required',
        data: null
      });
    }

    PhoneNo = PhoneNo.replace(/^\+91/, '');

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP expiry set to 15 minutes

    // Check if the user exists
    let user = await UserModel.findOne({ PhoneNo: PhoneNo });

    if (!user) {
      // If user does not exist, create a new user with the OTP and expiry
      user = await UserModel.create({
        PhoneNo: PhoneNo,
        Otp: otp.toString(),
        OtpExpiry: otpExpiry,
        isUserVerified: false, // Default to false, user will need to verify
      });
    } else {
      // If user exists, update the OTP and expiry
      user.Otp = otp.toString();
      user.OtpExpiry = otpExpiry;
      await user.save();
    }

    // Send OTP via SMS
    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: twilioNumber,
      to: `+91${PhoneNo}`
    });

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'OTP sent successfully',
      data: null
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    let { PhoneNo, Otp } = req.body;

    if (!PhoneNo || !Otp) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Phone number and OTP are required',
        data: null
      });
    }

    PhoneNo = PhoneNo.replace(/^\+91/, '');

    // Find the user by phone number
    const user = await UserModel.findOne({ PhoneNo: PhoneNo });

    if (!user) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'User not found',
        data: null
      });
    }

    // Check if the OTP is correct and not expired
    if (user.Otp !== Otp) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Invalid OTP',
        data: null
      });
    }

    if (new Date() > user.OtpExpiry!) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'OTP has expired',
        data: null
      });
    }

    // Update the user's verification status
    user.isUserVerified = true;
    user.Otp = undefined; // Clear OTP after successful verification
    user.OtpExpiry = undefined; // Clear OTP expiry after successful verification
    await user.save();

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '5h' }
    );

    // Send the response
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'OTP verified successfully',
      data: {
        jwtToken,
        userId: user._id
      }
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: null
    });
  }
};


// Create user by admin side
export const createUserByAdmin = async (req: Request, res: Response) => {
  try {
    // Get the logged-in admin ID from the decoded token
    const loggedInId = req['decodedToken']?.id;

    if (!loggedInId) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: 'Unauthorized',
        data: null
      });
    }

    // Extract user data from the request body
    const {
      FirstName,
      LastName,
      Phone,
      Address,
      Email,
      Profile,
      AlternateContactNumber,
      Allergies,
      NumberOfFamilyMembers,
      DOB,
      Height,
      Weight,
      Preferences,
      Gender,
      HowOftenYouCookedAtHome,
      WhatDoYouUsuallyCook,
      FamilyMembers,
      ExtraNotes,
      AssignedEmployee,
      Source,
      CustomerType,
      AlternateAddress
    } = req.body;

    if (!FirstName || !LastName || !Phone || !Address || !AssignedEmployee || !Source || !CustomerType) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: 'Missing required fields',
        data: null
      });
    }

    // Check if the Phone number or Email already exists
    const existingPhoneNumber = await UserModel.findOne({ Phone });
    if (existingPhoneNumber) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: 'Phone number already exists',
        data: null
      });
    }
    const existingEmailUser = await UserModel.findOne({ Email });
    if (existingEmailUser) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: 'Email already exists',
        data: null
      });
    }

    // Create a new user object while ignoring some fields
    const newUser = new UserModel({
      FirstName,
      LastName,
      Phone,
      Address,
      Email,
      Profile,
      AlternateContactNumber,
      Allergies,
      NumberOfFamilyMembers,
      DOB,
      Height,
      Weight,
      Preferences,
      Gender,
      HowOftenYouCookedAtHome,
      WhatDoYouUsuallyCook,
      FamilyMembers,
      ExtraNotes,
      AssignedEmployee,
      Source,
      CustomerType,
      AlternateAddress,
      CreatedBy: loggedInId, // Set the createdBy field to the admin's ID
      UpdatedBy: loggedInId // Optionally set the updatedBy field
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Send a response with the newly created user
    return res.status(201).json({
      status: true,
      statusCode: 201,
      message: 'User created successfully',
      data: savedUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: null
    });
  }
};
export const getAllUserByAdmin = async (req: Request, res: Response) => {
  try {
    // Get pagination parameters
    const currentPage = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (currentPage - 1) * limit;

    // Fetch users with pagination and populate necessary fields
    const users = await UserModel.find()
      .skip(skip)
      .limit(limit)
      .select('-Otp -OtpExpiry -Coupons') // Exclude OTP, OTP Expiry, Coupons fields
      .populate('AssignedEmployee', 'Name Email') // Adjust fields to populate as needed
      .populate('Source', 'Name')
      .populate('CustomerType', 'Name')
      .populate('CreatedBy', 'Email')
      .populate('UpdatedBy', 'Email');

      const total = await UserModel.countDocuments();
      const totalPages = Math.ceil(total / limit);

      const prevPage = currentPage > 1;
      const nextPage = currentPage < totalPages;


    // Return the users in the response
    responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: {
          total,
          currentPage,
          totalPages,
          prevPage,
          nextPage,
          users,
      }
  });

  } catch (error) {
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: 'Internal Server Error',
      data: null
    });
  }
};
export const getUserByIdForAdmin = async (req: Request, res: Response) => {
  const userId = req.params.id; // Extract user ID from request parameters

  try {
    // Validate the user ID
    if (!userId) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: 'User ID is required',
        data: null
      });
    }

    // Find the user by ID and populate all related fields
    const user = await UserModel.findById(userId)
      .populate({
        path: 'AssignedEmployee',
        select: 'FirstName LastName Email' // Adjust fields as needed
      })
      .populate({
        path: 'Source',
        select: 'Name' // Adjust fields as needed
      })
      .populate({
        path: 'CustomerType',
        select: 'Name' // Adjust fields as needed
      })
      .populate({
        path: 'CreatedBy',
        select: '-Password',
        populate: {
          path: 'Role', // Adjust this if the role field is nested differently
          select: 'roleName' // Adjust according to the role fields you need
        }
      })
      .populate({
        path: 'UpdatedBy',
        select: '-Password',
        populate: {
          path: 'Role', // Adjust this if the role field is nested differently
          select: 'roleName' // Adjust according to the role fields you need
        }
      })
      
      .exec();

    // Check if the user was found
    if (!user) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: 'User not found',
        data: null
      });
    }

    // Send a response with the user data
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error('Error retrieving user:', error.message);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message
    });
  }
};
export const updateUserByAdmin = async (req: Request, res: Response) => {
  try {
    // Get the logged-in admin ID from the decoded token
    const loggedInId = req['decodedToken']?.id;

    if (!loggedInId) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: 'Unauthorized',
        data: null
      });
    }

    const userId = req.params.id; // Get user ID from URL parameters

    if (!userId) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: 'User ID is required',
        data: null
      });
    }

    // Extract the update data from the request body, excluding Phone and Email
    const { Phone, Email, ...updateData } = req.body;

    // Find the user by ID and update with new data
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...updateData,
        UpdatedBy: loggedInId // Update the updatedBy field
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: 'User not found',
        data: null
      });
    }

    // Send a response with the updated user
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

export const updateAccountStatusByAdmin = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Get user ID from URL parameters
    const { AccountStatus } = req.body; // Get new account status from the request body

    if (!userId) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: 'User ID is required',
        data: null
      });
    }

    if (typeof AccountStatus !== 'boolean') {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: 'Invalid account status',
        data: null
      });
    }

    // Update the AccountStatus field
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { AccountStatus },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: 'User not found',
        data: null
      });
    }

    // Send a response with the updated user
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: 'Account status updated successfully',
    });
  } catch (error) {
    console.error('Error updating account status:', error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: null
    });
  }
};









// Create Feedback
export const CreateFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInUser = req['userId']; // Get user ID from request, ensure this is set correctly in your middleware

    const { Feedback, RatingValue,Order } = req.body;

    if (!Feedback || !RatingValue || Order) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Missing required values'
      });
    }
    

    const newFeedback = new FeedbackModel({
      CreatedBy: loggedInUser,
      UpdatedBy: loggedInUser,
      Feedback,
      Order,
      RatingValue
    });
    
    await newFeedback.save();
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 201,
      message: 'Feedback created successfully',
      data: newFeedback
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal Server Error',
      data: error.message
    });
  }
};

// Update Feedback (by User)
export const UpdateFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query as { id: string };
    const { Feedback } = req.body;

    if (!Feedback) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Feedback is required'
      });
    }

    const updatedFeedback = await FeedbackModel.findByIdAndUpdate(
      id,
      { Feedback },
      { new: true }
    );

    if (!updatedFeedback) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'Feedback not found'
      });
    }

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Feedback updated successfully',
      data: updatedFeedback
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal Server Error',
      data: error.message
    });
  }
};

// Delete Feedback (by User)
export const DeleteFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query as { id: string };
    const deletedFeedback = await FeedbackModel.findByIdAndDelete(id);
    
    if (!deletedFeedback) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'Feedback not found'
      });
    }

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal Server Error',
      data: error.message
    });
  }
};

// Get Feedback by User ID
export const GetFeedbackByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req['userId']; // Get user ID from request

    const feedbacks = await FeedbackModel.find({ CreatedBy: userId });

    if (!feedbacks.length) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'No feedback found for this user'
      });
    }

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Feedbacks fetched successfully',
      data: feedbacks
    });
  } catch (error) {
    console.error('Error fetching feedbacks by user:', error);
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal Server Error',
      data: error.message
    });
  }
};

// Get All Feedback (for User and Admin)
export const GetAllFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const feedbacks = await FeedbackModel.find();
    
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'All feedbacks fetched successfully',
      data: feedbacks
    });
  } catch (error) {
    console.error('Error fetching all feedbacks:', error);
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal Server Error',
      data: error.message
    });
  }
};

