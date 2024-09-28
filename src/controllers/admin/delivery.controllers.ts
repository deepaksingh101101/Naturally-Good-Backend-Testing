import { Request, Response } from 'express';
import CouponModel from '../../models/coupons.model';
import OrderModel from '../../models/order.model';
import SubscriptionModel from '../../models/subscription.model';
import { responseHandler } from '../../utils/send-response';
import DeliveryModel from '../../models/delivery.model';

export const getDeliveryByDate = async (req: Request, res: Response) => {
  try {
    const { StartDate, EndDate } = req.body;
    const currentPage = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (currentPage - 1) * limit;

    // Check if StartDate is provided
    if (!StartDate) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'StartDate is required.',
      });
    }

    // Initialize query object
    const query: any = {};

    // Handle case where only StartDate is provided
    if (StartDate && !EndDate) {
      try {
        const start = new Date(StartDate);
        start.setUTCHours(0, 0, 0, 0); // Start of the day
        const end = new Date(StartDate);
        end.setUTCHours(23, 59, 59, 999); // End of the day

        query.DeliveryDate = {
          $gte: start,
          $lte: end,
        };
      } catch (error) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: 'Invalid StartDate format.',
          data: error.message,
        });
      }
    }

    // Handle case where both StartDate and EndDate are provided
    if (StartDate && EndDate) {
      try {
        const start = new Date(StartDate);
        const end = new Date(EndDate);
        end.setUTCHours(23, 59, 59, 999); // End of the end day

        query.DeliveryDate = {
          $gte: start,
          $lte: end,
        };
      } catch (error) {
        return responseHandler.out(req, res, {
          status: false,
          statusCode: 400,
          message: 'Invalid date format for StartDate or EndDate.',
          data: error.message,
        });
      }
    }

    // Fetch deliveries based on query
    let deliveries;
    try {
      deliveries = await DeliveryModel.find(query)
        .skip(skip)
        .limit(limit)
        .populate('UserId', 'FirstName LastName Email Phone') // Populate user details
        .populate({
          path: 'AssignedRoute',
          select: 'RouteName', // Specify the fields you want to populate
        })
        .populate({
          path: 'Bag.BagID', // Populate BagID within Bag array
          select: 'BagName BagMaxWeight', // Select only specific fields of BagID
        })
        .exec();
    } catch (error) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Error fetching deliveries from the database.',
        data: error.message,
      });
    }
    // Group deliveries by UserId and format response
    let deliveriesGroupedByUser;
    try {
      deliveriesGroupedByUser = deliveries.reduce((acc: any, delivery: any) => {
        // Convert UserId to string before using it as a key
        const userId = delivery.UserId._id.toString(); // Convert ObjectId to string

        // Use type assertion to tell TypeScript the expected type after population
        const assignedRoute = delivery.AssignedRoute as any | null; // Assume AssignedRoute is of type Route

        // Format the bag details
        const bagDetails = delivery.Bag;

        // Format the delivery information
        const deliveryInfo = {
          DeliveryDate: delivery.DeliveryDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
          DeliveryTimeSlot: delivery.DeliveryTime || 'N/A', // Add time slot if available
          DeliveryStatus: delivery.Status,
          AssignedRoutes: assignedRoute ? assignedRoute : 'N/A', // Use route name if available
          Bag: bagDetails, // Add the bag details array
          SpecialInstruction: delivery.SpecialInstruction, // Add special instruction if available
        };

        // If the userId is not in the accumulator, create an array for the user
        if (!acc[userId]) {
          acc[userId] = {
            UserId: delivery.UserId,
            Deliveries: [],
          };
        }

        // Push the deliveryInfo object into the user's deliveries array
        acc[userId].Deliveries.push(deliveryInfo);
        return acc;
      }, {});
    } catch (error) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Error grouping deliveries by user.',
        data: error.message,
      });
    }

    // Format response as an array of objects, each with UserId and Deliveries
    const formattedResponse = Object.values(deliveriesGroupedByUser);

    // Get total count of documents matching the query
    let total;
    try {
      total = await DeliveryModel.countDocuments(query); // Count based on query
    } catch (error) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 500,
        message: 'Error counting total documents.',
        data: error.message,
      });
    }
    
    const totalPages = Math.ceil(total / limit);

    // Determine previous and next page numbers
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    // Return the formatted deliveries
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Deliveries fetched successfully',
      data: {
        total,
        currentPage,
        totalPages,
        prevPage,
        nextPage,
        deliverys: formattedResponse,
      },
    });
  } catch (error) {
    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};



export const getDeliveryDetails = async (req: Request, res: Response) => {
  try {
    // Get UserId and DeliveryDate from query parameters
    const { UserId, DeliveryDate } = req.query;

    // Check if UserId or DeliveryDate is missing
    if (!UserId || !DeliveryDate) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Missing UserId or DeliveryDate in the request query parameters.',
      });
    }

    // Convert DeliveryDate to a Date object
    const deliveryDateObject = new Date(DeliveryDate as string);

    // Validate DeliveryDate
    if (isNaN(deliveryDateObject.getTime())) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Invalid DeliveryDate format. Please provide a valid date.',
      });
    }

    // Convert the date to ISO string in the format of YYYY-MM-DD without time
    const dateStart = new Date(
      deliveryDateObject.getFullYear(),
      deliveryDateObject.getMonth(),
      deliveryDateObject.getDate()
    );

    const dateEnd = new Date(
      deliveryDateObject.getFullYear(),
      deliveryDateObject.getMonth(),
      deliveryDateObject.getDate() + 1
    );


    // Find orders by UserId and populate necessary fields
    const allOrders = await OrderModel.find({ UserId: UserId })
      .populate('UserId')
      .populate('SubscriptionId')
      .populate({
        path: 'Deliveries',
        match: { DeliveryDate: dateEnd}, // Match the date range
        select: 'DeliveryDate DeliveryTime',
        populate: [
          { path: 'AssignedRoute' },
          {
            path: 'Bag.BagID',
            select: 'bagName bagType AllowedItems', // Select fields to return from BagID
            populate: {
              path: 'AllowedItems',
              populate: [
                { path: 'Type', select: 'Name SortOrder' }, // Populate Type field
                { path: 'Season', select: 'Name' }, // Populate Season field
                { path: 'Roster', select: 'Name SortOrder' } // Populate Roster field
              ]
            },
          },
        ],
      })
      .exec();


    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Order retrieved successfully',
      data: allOrders,
    });
  } catch (error) {
    console.error('Error in getDeliveryDetails:', error);

    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};




