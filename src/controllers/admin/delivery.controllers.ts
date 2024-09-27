import { Request, Response } from 'express';
import CouponModel from '../../models/coupons.model';
import OrderModel from '../../models/order.model';
import SubscriptionModel from '../../models/subscription.model';
import { responseHandler } from '../../utils/send-response';
import DeliveryModel from '../../models/delivery.model';

export const getDeliveryByDate = async (req: Request, res: Response) => {
  try {
    const { StartDate, EndDate } = req.body;

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
      const start = new Date(StartDate);
      start.setUTCHours(0, 0, 0, 0); // Start of the day
      const end = new Date(StartDate);
      end.setUTCHours(23, 59, 59, 999); // End of the day

      query.DeliveryDate = {
        $gte: start,
        $lte: end,
      };
    }

    // Handle case where both StartDate and EndDate are provided
    if (StartDate && EndDate) {
      const start = new Date(StartDate);
      const end = new Date(EndDate);
      end.setUTCHours(23, 59, 59, 999); // End of the end day

      query.DeliveryDate = {
        $gte: start,
        $lte: end,
      };
    }

    // Find deliveries based on the constructed query
    const deliveries = await DeliveryModel.find(query)
      .populate('UserId', 'FirstName LastName Email Phone') // Populate user details
      .populate('AssignedRoute', 'RouteName') // Populate assigned route details
      .populate({
        path: 'Bag.BagID', // Populate BagID within Bag array
        select: 'BagName BagMaxWeight', // Select only specific fields of BagID
      })
      .exec();

    // Group deliveries by UserId and format response
    const deliveriesGroupedByUser = deliveries.reduce((acc: any, delivery:any) => {
      // Convert UserId to string before using it as a key
      const userId = delivery.UserId._id.toString(); // Convert ObjectId to string

      // Use type assertion to tell TypeScript the expected type after population
      const assignedRoute = delivery.AssignedRoute as any | null; // Assume AssignedRoute is of type Route

      // Format the bag details
      const bagDetails = delivery.Bag.map((bag) => ({
        BagID: bag.BagID,
        BagWeight: bag.BagWeight,
        _id: bag._id,
      }));

      // Format the delivery information
      const deliveryInfo = {
        DeliveryDate: delivery.DeliveryDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        DeliveryTimeSlot: delivery.DeliveryTime || 'N/A', // Add time slot if available
        DeliveryStatus: delivery.Status,
        AssignedRoutes: assignedRoute ? assignedRoute.RouteName : 'N/A', // Use route name if available
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

    // Format response as an array of objects, each with UserId and Deliveries
    const formattedResponse = Object.values(deliveriesGroupedByUser);

    // Return the formatted deliveries
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Deliveries fetched successfully',
      data: formattedResponse,
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


