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
    const limit = parseInt(req.query.limit as string);

    // If limit is not provided or is invalid (NaN), use a very large number
    const documentsLimit = isNaN(limit) ? await DeliveryModel.countDocuments() : limit;
    
    // Query the documents with the determined limit
    const documents = await DeliveryModel.find().limit(documentsLimit);

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
          _id: delivery._id,
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





// export const getDeliveryById = async (req: Request, res: Response) => {
//   try {
//     const { DeliveryId } = req.query;

//     if (!DeliveryId) {
//       return responseHandler.out(req, res, {
//         status: false,
//         statusCode: 400,
//         message: 'Missing DeliveryId in the request query parameters.',
//       });
//     }

//     const delivery:any = await DeliveryModel.findById(DeliveryId)
//     .populate({
//       path: 'UserId',
//       model: 'User', // Explicitly specify the User model
//       populate: {
//         path: 'Address.City', // Populate the City field within Address
//         model: 'City', // Explicitly specify the City model (if necessary)
//         select:'CityName'
//       },
//     })
//       .populate({
//         path: 'AssignedRoute',
//         model: 'Route',
//         select: 'RouteName',
//       })
//       .populate({
//         path: 'DeliveryTime',
//         model: 'DeliveryTimeSlot',
//       })
//       .populate({
//         path: 'Bag.BagID',
//         model: 'Bag',
//         populate: {
//           path: 'AllowedItems',
//           model: 'Product',
//           populate: [
//             {
//               path: 'Type',
//               model: 'ProductType',
//               select: 'Name SortOrder',
//             },
//             {
//               path: 'Season',
//               model: 'Season',
//               select: 'Name',
//             },
//             {
//               path: 'Priority',
//               model: 'ProductPriority',
//               select: 'Name',
//             },
//             {
//               path: 'Roster',
//               model: 'Roster',
//               select: 'Name SortOrder',
//             },
//             {
//               path: 'Group',
//               model: 'ProductGroup',
//               select: 'Name SortOrder',
//             },
//           ]
//         },
//       })
//       .populate({
//         path: 'Product.ProductId',
//         model: 'Product',
//       })
//       .populate({
//         path: 'Addons.ProductId',
//         model: 'Product',
//       })
//       .populate({
//         path: 'CreatedBy UpdatedBy',
//         model: 'Employee',
//         select: 'FirstName LastName Phone Email',
//       });

//     if (!delivery) {
//       return responseHandler.out(req, res, {
//         status: false,
//         statusCode: 404,
//         message: 'Delivery not found.',
//       });
//     }

//     // Ensure AllowedItems is defined before sorting
//     if (delivery.Bag.BagID && delivery.Bag.BagID.AllowedItems) {
//       delivery.Bag.BagID.AllowedItems.sort((a, b) => {
//         const rosterSortA = a.Roster?.SortOrder || Infinity; // Fallback to Infinity if undefined
//         const rosterSortB = b.Roster?.SortOrder || Infinity;
//         const typeSortA = a.Type?.SortOrder || Infinity;
//         const typeSortB = b.Type?.SortOrder || Infinity;

//         // Sort by Roster SortOrder first, then by Type SortOrder
//         if (rosterSortA === rosterSortB) {
//           return typeSortA - typeSortB; // Ascending order
//         }
//         return rosterSortA - rosterSortB; // Ascending order
//       });
//     }

//  // Find the order that contains the specified DeliveryId in the Deliveries array
//  const order = await OrderModel.findOne({
//   Deliveries: DeliveryId,
// })
//   .populate({
//     path: 'SubscriptionId',
//     populate: [
//       { path: 'FrequencyId',
//        }, // Populate FrequencyId from Subscription
//       { path: 'SubscriptionTypeId' } // Populate SubscriptionTypeId from Subscription
//     ]
//   });

// if (!order) {
//   return res.status(404).json({
//     status: false,
//     message: 'No subscription found for the specified DeliveryId.',
//   });
// }


//     return responseHandler.out(req, res, {
//       status: true,
//       statusCode: 200,
//       message: 'Delivery fetched successfully.',
//       data: {delivery,order},
//     });

//   } catch (error) {
//     console.error('Error in getDeliveryById:', error);

//     return responseHandler.out(req, res, {
//       status: false,
//       statusCode: 500,
//       message: 'Internal server error',
//       data: error.message,
//     });
//   }
// };


export const getDeliveryById = async (req: Request, res: Response) => {
  try {
    const { DeliveryId } = req.query;

    if (!DeliveryId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Missing DeliveryId in the request query parameters.',
      });
    }

    const delivery: any = await DeliveryModel.findById(DeliveryId)
      .populate({
        path: 'UserId',
        model: 'User',
        populate: {
          path: 'Address.City',
          model: 'City',
          select: 'CityName',
        },
      })
      .populate({
        path: 'AssignedRoute',
        model: 'Route',
        select: 'RouteName',
      })
      .populate({
        path: 'DeliveryTime',
        model: 'DeliveryTimeSlot',
      })
      .populate({
        path: 'Bag.BagID',
        model: 'Bag',
        populate: {
          path: 'AllowedItems',
          model: 'Product',
          populate: [
            {
              path: 'Type',
              model: 'ProductType',
              select: 'Name SortOrder',
            },
            {
              path: 'Season',
              model: 'Season',
              select: 'Name',
            },
            {
              path: 'Priority',
              model: 'ProductPriority',
              select: 'Name',
            },
            {
              path: 'Roster',
              model: 'Roster',
              select: 'Name SortOrder',
            },
            {
              path: 'Group',
              model: 'ProductGroup',
              select: 'Name SortOrder',
            },
          ],
        },
      })
      .populate({
        path: 'Product.ProductId',
        model: 'Product',
      })
      .populate({
        path: 'Addons.ProductId',
        model: 'Product',
      })
      .populate({
        path: 'CreatedBy UpdatedBy',
        model: 'Employee',
        select: 'FirstName LastName Phone Email',
      });

    if (!delivery) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'Delivery not found.',
      });
    }

    // Ensure AllowedItems is defined before sorting and filtering
    if (delivery.Bag.BagID && delivery.Bag.BagID.AllowedItems) {
      // Sort AllowedItems first
      delivery.Bag.BagID.AllowedItems.sort((a, b) => {
        const rosterSortA = a.Roster?.SortOrder || Infinity; // Fallback to Infinity if undefined
        const rosterSortB = b.Roster?.SortOrder || Infinity;
        const typeSortA = a.Type?.SortOrder || Infinity;
        const typeSortB = b.Type?.SortOrder || Infinity;

        // Sort by Roster SortOrder first, then by Type SortOrder
        if (rosterSortA === rosterSortB) {
          return typeSortA - typeSortB; // Ascending order
        }
        return rosterSortA - rosterSortB; // Ascending order
      });

      // Filter out AllowedItems with Roster SortOrder of 0
      delivery.Bag.BagID.AllowedItems = delivery.Bag.BagID.AllowedItems.filter(item => item.Roster?.SortOrder !== 0);
    }

    // Find the order that contains the specified DeliveryId in the Deliveries array
    const order = await OrderModel.findOne({
      Deliveries: DeliveryId,
    })
      .populate({
        path: 'SubscriptionId',
        populate: [
          { path: 'FrequencyId' }, // Populate FrequencyId from Subscription
          { path: 'SubscriptionTypeId' }, // Populate SubscriptionTypeId from Subscription
        ],
      });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: 'No subscription found for the specified DeliveryId.',
      });
    }

    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Delivery fetched successfully.',
      data: { delivery, order },
    });

  } catch (error) {
    console.error('Error in getDeliveryById:', error);

    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};




export const UpdateDeliveryBag = async (req: Request, res: Response) => {
  try {
    const { DeliveryId } = req.params; // Assuming DeliveryId is in the URL parameters
    const {updateData} = req.body; // The data to update the delivery bag


    // Validate DeliveryId
    if (!DeliveryId) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Missing DeliveryId in the request parameters.',
      });
    }

    // Find the delivery document
    const delivery = await DeliveryModel.findById(DeliveryId);

    // Check if delivery exists
    if (!delivery) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'Delivery not found.',
      });
    }

    // Update delivery bag details
    if (updateData.Bag) {
      delivery.Bag = {
        ...delivery.Bag, // Retain existing Bag properties
        ...updateData.Bag, // Update with new Bag data
      };
    }

    // Update other fields if provided
    if (updateData.Product) {
      delivery.Product = updateData.Product; // Replace products with the new array
    }

    if (updateData.Addons) {
      delivery.Addons = updateData.Addons; // Replace addons with the new array
    }
    if (updateData.DeliveryTime) {
      delivery.DeliveryTime = updateData.DeliveryTime; // Replace addons with the new array
    }
    if (updateData.Note) {
      delivery.Note = updateData.Note; // Replace addons with the new array
    }
    if (updateData.AssignedRoute) {
      delivery.AssignedRoute = updateData.AssignedRoute; // Replace addons with the new array
    }


    // Save the updated delivery document
    const updatedDelivery = await delivery.save();

    // Respond with the updated delivery
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Delivery bag updated successfully.',
      data: updatedDelivery, // Return the updated delivery data
    });

  } catch (error) {
    console.error('Error in UpdateDeliveryBag:', error);

    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};


// Toggle status of a delivery
export const UpdateDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const { DeliveryId } = req.params; // Assuming DeliveryId is in the URL parameters
    const { DeliveryStatus } = req.body; // The status to update the delivery

    // Validate DeliveryId and DeliveryStatus
    if (!DeliveryId || DeliveryStatus === undefined) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 400,
        message: 'Missing required parameters.',
      });
    }

    // Find the delivery document
    const delivery = await DeliveryModel.findById(DeliveryId);

    // Check if delivery exists
    if (!delivery) {
      return responseHandler.out(req, res, {
        status: false,
        statusCode: 404,
        message: 'Delivery not found.',
      });
    }

    // Update the delivery status
    delivery.Status = DeliveryStatus; // Update the status directly

    // Save the updated delivery document
    const updatedDelivery = await delivery.save();

    // Respond with the updated delivery
    return responseHandler.out(req, res, {
      status: true,
      statusCode: 200,
      message: 'Delivery Status updated successfully.',
      data: updatedDelivery, // Return the updated delivery data
    });

  } catch (error) {
    console.error('Error in Updating Status:', error);

    return responseHandler.out(req, res, {
      status: false,
      statusCode: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
};