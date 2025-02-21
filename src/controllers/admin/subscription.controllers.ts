import { Request, Response } from 'express';
import SubscriptionModel from '../../models/subscription.model';
import { FrequencyTypeModel, SubscriptionTypeModel } from '../../models/dropdown.model';
import { BagModel } from '../../models/bag.model';
import { responseHandler } from '../../utils/send-response';

export const createSubscription = async (req: Request, res: Response) => {
  try {
      const loggedInId = req['decodedToken']?.id;

      const { SubscriptionTypeId, FrequencyId, TotalDeliveryNumber, Visibility, Status, Bag, DeliveryDays, OriginalPrice, Offer, NetPrice, ImageUrl, Description } = req.body;

      // Check if all required fields are present
      if (!SubscriptionTypeId || !FrequencyId || !TotalDeliveryNumber || !Visibility || !Status || !Bag || !DeliveryDays || !OriginalPrice || !NetPrice || !Description) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 400,
              message: 'Missing required fields'
          });
      }
      const isSubscriptionTypeExist=await SubscriptionTypeModel.findById(SubscriptionTypeId)
      if(!isSubscriptionTypeExist){
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: 'Subscription Type not found'
          });
      }

      const isFrequencyExist=await FrequencyTypeModel.findById(FrequencyId)
      if(!isFrequencyExist){
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: 'Frequency Type not found'
          });
      }
      const isBagExist=await BagModel.findById(Bag)
      if(!isBagExist){
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: 'Bag not found'
          });
      }


      const isSubscriptionExist = await SubscriptionModel.find({
        SubscriptionTypeId,
        FrequencyId,
        Bag,
        DeliveryDays,
        TotalDeliveryNumber
    });
    
    if (isSubscriptionExist.length > 0) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 404,
            message: 'Subscription already exist'
        });
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
      responseHandler.out(req, res, {
          status: true,
          statusCode: 201,
          message: 'Subscription created successfully',
          data: subscription
      });
  } catch (error) {
      console.error('Error creating subscription:', error);
      responseHandler.out(req, res, {
          status: false,
          statusCode: 500,
          message: 'Internal server error'
      });
  }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
      const currentPage = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (currentPage - 1) * limit;

      // Populate SubscriptionTypeId, FrequencyId, and Bag fields
      const subscriptions = await SubscriptionModel.find()
          .skip(skip)
          .limit(limit)
          .populate('SubscriptionTypeId') // Populate SubscriptionTypeId field
          .populate('FrequencyId') // Populate FrequencyId field
          .populate('Bag'); // Populate Bag field

      const total = await SubscriptionModel.countDocuments();
      const totalPages = Math.ceil(total / limit);

      const prevPage = currentPage > 1;
      const nextPage = currentPage < totalPages;

      responseHandler.out(req, res, {
          status: true,
          statusCode: 200,
          message: 'Subscriptions fetched successfully',
          data: {
              total,
              currentPage,
              totalPages,
              prevPage,
              nextPage,
              subscriptions,
          }
      });
  } catch (error) {
      console.error('Error fetching subscriptions:', error);
      responseHandler.out(req, res, {
          status: false,
          statusCode: 500,
          message: 'Internal server error'
      });
  }
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 400,
              message: 'Invalid subscription ID format'
          });
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
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: 'Subscription not found'
          });
      }

      responseHandler.out(req, res, {
          status: true,
          statusCode: 200,
          message: 'Subscription fetched successfully',
          data: subscription
      });
  } catch (error) {
      console.error('Error fetching subscription by ID:', error);
      responseHandler.out(req, res, {
          status: false,
          statusCode: 500,
          message: 'Internal server error'
      });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;
      const AdminId = req['adminId'];
      const { SubscriptionTypeId, FrequencyId, Bags } = req.body;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 400,
              message: 'Invalid subscription ID format'
          });
      }

      // Check if the referenced FrequencyType exists
      if (FrequencyId) {
          const frequencyType = await FrequencyTypeModel.findById(FrequencyId);
          if (!frequencyType) {
              return responseHandler.out(req, res, {
                  status: false,
                  statusCode: 400,
                  message: 'Invalid FrequencyType ID'
              });
          }
      }

      // Check if the referenced SubscriptionType exists
      if (SubscriptionTypeId) {
          const subscriptionType = await SubscriptionTypeModel.findById(SubscriptionTypeId);
          if (!subscriptionType) {
              return responseHandler.out(req, res, {
                  status: false,
                  statusCode: 400,
                  message: 'Invalid SubscriptionType ID'
              });
          }
      }

      // Check if the referenced Bags exist
      if (Bags && Bags.length > 0) {
          for (const bagId of Bags) {
              const bag = await BagModel.findById(bagId);
              if (!bag) {
                  return responseHandler.out(req, res, {
                      status: false,
                      statusCode: 400,
                      message: `Invalid Bag ID: ${bagId}`
                  });
              }
          }
      }

      const subscription = await SubscriptionModel.findByIdAndUpdate(
          id,
          { ...req.body, updatedBy: AdminId, UpdatedAt: new Date().toISOString() },
          { new: true, runValidators: true }
      );

      if (!subscription) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: 'Subscription not found'
          });
      }

      responseHandler.out(req, res, {
          status: true,
          statusCode: 200,
          message: 'Subscription updated successfully',
          data: subscription
      });
  } catch (error) {
      console.error('Error updating subscription:', error);
      responseHandler.out(req, res, {
          status: false,
          statusCode: 500,
          message: 'Internal server error'
      });
  }
};

export const updateSubscriptionStatus = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;
      const { Status } = req.body;

      // Validate ID format
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 400,
              message: 'Invalid Subscription ID format'
          });
      }

      // Ensure `Status` is a boolean
      if (typeof Status !== 'boolean') {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 400,
              message: 'Status must be a boolean value'
          });
      }

      // Update the Status field of the Subscription
      const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
          id,
          { Status: Status },
          { new: true } // Return the updated document
      );

      if (!updatedSubscription) {
          return responseHandler.out(req, res, {
              status: false,
              statusCode: 404,
              message: 'Subscription not found'
          });
      }

      responseHandler.out(req, res, {
          status: true,
          statusCode: 200,
          message: 'Subscription status updated successfully',
          data: updatedSubscription
      });
  } catch (error) {
      console.error('Error updating subscription status:', error);
      responseHandler.out(req, res, {
          status: false,
          statusCode: 500,
          message: 'Internal server error'
      });
  }
};

  // Not working or not needed
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



export const searchSubscription = async (req: Request, res: Response) => {
    try {
        const filters = req.query;
        const pipeline: any[] = [];

        // Pagination setup
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        // Filter based on term
        if (filters.term) {
            const term = filters.term as string;
            pipeline.push(
                {
                    $lookup: {
                        from: 'subscriptiontypes', // Collection name for SubscriptionType
                        localField: 'SubscriptionTypeId',
                        foreignField: '_id',
                        as: 'subscriptionType',
                    },
                },
                {
                    $lookup: {
                        from: 'frequencytypes', // Collection name for FrequencyType
                        localField: 'FrequencyId',
                        foreignField: '_id',
                        as: 'frequencyType',
                    },
                },
                {
                    $lookup: {
                        from: 'bags', // Collection name for Bag
                        localField: 'Bag',
                        foreignField: '_id',
                        as: 'bag',
                    },
                },
                {
                    $match: {
                        $or: [
                            { 'subscriptionType.Name': { $regex: new RegExp(term, 'i') } },
                            { 'frequencyType.Name': { $regex: new RegExp(term, 'i') } },
                            { 'bag.BagName': { $regex: new RegExp(term, 'i') } },
                        ],
                    },
                }
            );
        }

        // Add pagination to the pipeline
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        // Execute the aggregation pipeline
        const subscriptions = await SubscriptionModel.aggregate(pipeline);

        // Count documents after filtering for total count
        const countPipeline = [...pipeline];
        countPipeline.pop(); // Remove limit stage for count
        countPipeline.pop(); // Remove skip stage for count

        const total = await SubscriptionModel.aggregate([...countPipeline, { $count: 'total' }]);
        const totalCount = total[0]?.total || 0;
        const totalPages = Math.ceil(totalCount / limit);

        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        if (subscriptions.length === 0) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'No Subscription found matching the criteria.',
            });
        }

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Subscriptions retrieved successfully',
            data: {
                total: totalCount,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                subscriptions,
            },
        });
    } catch (error) {
        console.error(error);
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
};
