import { Request, Response } from 'express';
import { client, twilioNumber } from '../../twilio';
import FeedbackModel from '../models/feedback.model';
import UserModel from '../models/user.model';
import { BagModel } from '../models/bag.model';

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


// Create Bag
export const CreateBag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { VegetablesItems, TotalAmount } = req.body;
    // const UserId = "3424524t";
    const UserId =req['userId']


    // Validate required fields
    if (!UserId || !VegetablesItems || !TotalAmount) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Validate VegetablesItems format and quantity constraints
    if (!Array.isArray(VegetablesItems) || VegetablesItems.length === 0) {
      res.status(400).json({ message: 'VegetablesItems must be a non-empty array' });
      return;
    }

    let totalQuantity = 0;
    for (const item of VegetablesItems) {
      if (!item.VegetableName || !item.Quantity || !item.Price) {
        res.status(400).json({ message: 'Each vegetable item must contain VegetableName, Quantity, and Price' });
        return;
      }

      totalQuantity += item.Quantity;
    }

    if (totalQuantity < 5 || totalQuantity > 10) {
      res.status(400).json({ message: 'The total quantity of vegetables should be between 5 and 10' });
      return;
    }

    const newBag = new BagModel({
      UserId,
      VegetablesItems,
      TotalAmount,
    });

    const savedBag = await newBag.save();
    res.status(201).json(savedBag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Bag
export const GetBagByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const UserId =req['userId']// Assuming you get this from authentication or request

    const bag = await BagModel.find({ UserId });

    if (!bag) {
      res.status(404).json({ message: 'Bag not found' });
      return;
    }

    res.json(bag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Bag
export const DeleteBagByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const UserId =req['userId'] // Assuming you get this from authentication or request
    // const {id} =req.params// Assuming you get this from authentication or request
    const {id} =req.query;
    const deletedBag = await BagModel.findOneAndDelete({id});

    if (!deletedBag) {
      res.status(404).json({ message: 'Bag not found' });
      return;
    }

    res.json({ message: 'Bag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Bag
export const UpdateBagByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const UserId =req['userId'] // Assuming you get this from authentication or request
    const {id} =req.query;
    const { VegetablesItems, TotalAmount } = req.body;

    // Validate required fields
    if (!UserId || !VegetablesItems || !TotalAmount) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Validate VegetablesItems format and quantity constraints
    if (!Array.isArray(VegetablesItems) || VegetablesItems.length === 0) {
      res.status(400).json({ message: 'VegetablesItems must be a non-empty array' });
      return;
    }

    let totalQuantity = 0;
    for (const item of VegetablesItems) {
      if (!item.VegetableName || !item.Quantity || !item.Price) {
        res.status(400).json({ message: 'Each vegetable item must contain VegetableName, Quantity, and Price' });
        return;
      }

      totalQuantity += item.Quantity;
    }

    if (totalQuantity < 5 || totalQuantity > 10) {
      res.status(400).json({ message: 'The total quantity of vegetables should be between 5 and 10' });
      return;
    }

    const updatedBag = await BagModel.findOneAndUpdate(
      { id },
      { VegetablesItems, TotalAmount },
      { new: true } // Return the updated document
    );

    if (!updatedBag) {
      res.status(404).json({ message: 'Bag not found' });
      return;
    }

    res.json(updatedBag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create Feedback
export const CreateFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const CreatedBy=req['userId'] //get from request

    const {  Feedback,RatingValue } = req.body;
    const newFeedback = new FeedbackModel({ CreatedBy, Feedback });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Update Feedback (by User)
export const UpdateFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const {id} =req.query;
    const { Feedback } = req.body;

    const updatedFeedback = await FeedbackModel.findByIdAndUpdate(
      id,
      { Feedback },
      { new: true }
    );

    if (!updatedFeedback) {
      res.status(404).json({ message: 'Feedback not found' });
      return;
    }
    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Feedback (by User)
export const DeleteFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    const deletedFeedback = await FeedbackModel.findByIdAndDelete(id);
    if (!deletedFeedback) {
      res.status(404).json({ message: 'Feedback not found' });
      return;
    }
    res.status(200).json({ message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Feedback by UserId (for Admin)
export const GetFeedbackByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    const feedbacks = await FeedbackModel.find({ CreatedBy: id });
    if (!feedbacks.length) {
      res.status(404).json({ message: 'No feedback found for this user' });
      return;
    }
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get All Feedback (for User and Admin)
export const GetAllFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const feedbacks = await FeedbackModel.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

