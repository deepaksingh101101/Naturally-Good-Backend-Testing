import { Request, Response } from 'express';
import SubscriptionModel from '../../models/subscription.model';
import { FrequencyTypeModel, SubscriptionTypeModel } from '../../models/dropdown.model';
import { BagModel } from '../../models/bag.model';

export const createSubscription = async (req: Request, res: Response) => {
    try {
        const loggedInId = req['decodedToken']?.id

        const { SubscriptionTypeId, FrequencyId, TotalDeliveryNumber, Visibility, Status, Bag, DeliveryDays, OriginalPrice, Offer, NetPrice, ImageUrl, Description } = req.body;

        // Check if all required fields are present
        if (!SubscriptionTypeId || !FrequencyId || !TotalDeliveryNumber || !Visibility || !Status || !Bag || !DeliveryDays || !OriginalPrice || !NetPrice || !Description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }


        const subscription = new SubscriptionModel({
            SubscriptionTypeId,
            FrequencyId,
            TotalDeliveryNumber,
            Visibility,
            Status,
            Bag,
            DeliveryDays,
            OriginalPrice,
            Offer,
            NetPrice,
            ImageUrl,
            Description,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId
        });

        await subscription.save();
        res.status(201).json(subscription);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
    try {
      const currentpage = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (currentpage - 1) * limit;

      // Populate SubscriptionTypeId, FrequencyId, and Bag fields
      const subscriptions = await SubscriptionModel.find()
        .skip(skip)
        .limit(limit)
        .populate('SubscriptionTypeId') // Populate SubscriptionTypeId field
        .populate('FrequencyId') // Populate FrequencyId field
        .populate('Bag'); // Populate Bag field
  
      const total = await SubscriptionModel.countDocuments();
      const totalPages = Math.ceil(total / limit);
  
      const prevPage = currentpage > 1;
      const nextPage = currentpage < totalPages;
  
      res.status(200).json({
        total,
        currentpage,
        totalpages: totalPages,
        prevPage,
        nextPage,
        subscriptions,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  export const getSubscriptionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid subscription ID format' });
      }
  
      // Populate SubscriptionTypeId, FrequencyId, Bag, CreatedBy, and UpdatedBy fields
      const subscription = await SubscriptionModel.findById(id)
        .populate('SubscriptionTypeId') // Populate SubscriptionTypeId field
        .populate('FrequencyId') // Populate FrequencyId field
        .populate('CreatedBy') // Populate CreatedBy field
        .populate('UpdatedBy') // Populate UpdatedBy field
        .populate({
          path: 'Bag', // Populate Bag field
          populate: {
            path: 'AllowedItems', // Populate AllowedItems within Bag
            model: 'Product', // Ensure to use the correct model name if it's different
          },
        });
  
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }
  
      res.status(200).json(subscription);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
export const updateSubscription = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const AdminId = req['adminId'];
        const { SubscriptionTypeId, FrequencyId, Bags } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid subscription ID format' });
        }

        // Check if the referenced FrequencyType exists
        if (FrequencyId) {
            const frequencyType = await FrequencyTypeModel.findById(FrequencyId);
            if (!frequencyType) {
                return res.status(400).json({ error: 'Invalid FrequencyType ID' });
            }
        }

        // Check if the referenced SubscriptionType exists
        if (SubscriptionTypeId) {
            const subscriptionType = await SubscriptionTypeModel.findById(SubscriptionTypeId);
            if (!subscriptionType) {
                return res.status(400).json({ error: 'Invalid SubscriptionType ID' });
            }
        }

        // Check if the referenced Bags exist
        if (Bags && Bags.length > 0) {
            for (const bagId of Bags) {
                const bag = await BagModel.findById(bagId);
                if (!bag) {
                    return res.status(400).json({ error: `Invalid Bag ID: ${bagId}` });
                }
            }
        }

        const subscription = await SubscriptionModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedBy: AdminId, UpdatedAt: new Date().toISOString() },
            { new: true, runValidators: true }
        );

        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteSubscription = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid subscription ID format' });
        }

        const subscription = await SubscriptionModel.findByIdAndDelete(id);

        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const filterSubscriptions = async (req: Request, res: Response) => {
    try {
        const filters = req.query;
        const query: any = {};

        if (filters.SubscriptionTypeId) {
            query.SubscriptionTypeId = filters.SubscriptionTypeId;
        }
        if (filters.FrequencyId) {
            query.FrequencyId = filters.FrequencyId;
        }
        if (filters.Visibility) {
            query.Visibility = filters.Visibility;
        }
        if (filters.Status) {
            query.Status = filters.Status;
        }
        if (filters.OriginalPrice) {
            query.OriginalPrice = +filters.OriginalPrice;
        }
        if (filters.NetPrice) {
            query.NetPrice = +filters.NetPrice;
        }

        const subscriptions = await SubscriptionModel.find(query);

        if (subscriptions.length === 0) {
            return res.status(404).json({ error: 'Subscriptions not found' });
        }

        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const updateSubscriptionStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { Status } = req.body;
  
      // Validate ID format
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid Subscription ID format' });
      }
  
      // Ensure `Status` is a boolean
      if (typeof Status !== 'boolean') {
        return res.status(400).json({ error: 'Status must be a boolean value' });
      }
  
      // Update the Status field of the Subscription
      const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
        id,
        { Status: Status },
        { new: true } // Return the updated document
      );
  
      if (!updatedSubscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }
  
      res.status(200).json({ message: 'Subscription status updated successfully', subscription: updatedSubscription });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
