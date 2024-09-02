import { Request, Response } from 'express';
import { client, twilioNumber } from '../../twilio';
import FeedbackModel from '../models/feedback.model';
import UserModel from '../models/user.model';
import { BagModel } from '../models/bag.model';
import { responseHandler } from '../utils/send-response';

export const sendOTP = async (req: Request, res: Response) => {
  try {
    let { phoneNo } = req.body;
    if (!phoneNo) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    phoneNo = phoneNo.replace(/^\+91/, '');

    const otp = Math.floor(100000 + Math.random() * 900000);


    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: twilioNumber,
      to: `+91${phoneNo}`
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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

