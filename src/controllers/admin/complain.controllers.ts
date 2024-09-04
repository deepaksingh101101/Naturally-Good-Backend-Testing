import ComplaintModel from "../../models/complaints.model";
import ComplaintsTypeModel, { StatusType } from "../../models/complaintsType.model";
import DeliveryModel from "../../models/delivery.model";
import { responseHandler } from "../../utils/send-response";

// Create Compliment Type
export const createComplainType = async (req, res) => {
    const { ComplaintType, Status, Description } = req.body;
    const loggedInId = req['decodedToken']?.id;

    if (!loggedInId) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'Forbidden'
        });
    }

    // Validate required fields
    if (!ComplaintType || typeof ComplaintType !== 'string') {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'ComplaintType is required and must be a string'
        });
    }

    if (Status && !Object.values(StatusType).includes(Status)) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: `Status must be one of the following: ${Object.values(StatusType).join(', ')}`
        });
    }

    try {
        // Check if the complaint type already exists (case-insensitive)
        const existingComplaintType = await ComplaintsTypeModel.findOne({
            ComplaintType: { $regex: new RegExp(`^${ComplaintType}$`, 'i') }
        });

        if (existingComplaintType) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'ComplaintType already exists'
            });
        }

        // Create a new Complaint Type
        const newComplaintType = new ComplaintsTypeModel({
            ComplaintType,
            Status,
            Description,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId,
        });

        // Save to the database
        await newComplaintType.save();

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Complaint Type created successfully",
            data:newComplaintType
        });
    } catch (error) {
        console.error(error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// Get all Compliment Types
export const getAllComplainTypes = async (req, res) => {
    try {
        const complimentTypes = await ComplaintsTypeModel.find();
        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Compliment Types fetched successfully",
            data:complimentTypes
        });
    } catch (error) {
        console.error(error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// Get a Compliment Type by ID
export const getComplainTypeById = async (req, res) => {
    const { id } = req.params;

    try {
        const complimentType = await ComplaintsTypeModel.findById(id)
        .populate('CreatedBy','-Password')
        .populate('UpdatedBy','-Password')
        .exec();


        if (!complimentType) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Compliment Type not found'
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Compliment Type fetched successfully",
            data:complimentType
        });
    } catch (error) {
        console.error(error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// Update Compliment Type by ID
export const updateComplainType = async (req, res) => {
    const { id } = req.params;
    const { ComplaintType, Status, Description } = req.body;
    const loggedInId = req['decodedToken']?.id;

    try {
        const complaintType = await ComplaintsTypeModel.findById(id);

        if (!complaintType) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Complaint Type not found'
            });
        }

        if (ComplaintType && typeof ComplaintType !== 'string') {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'ComplaintType must be a string'
            });
        }

        if (Status && !Object.values(StatusType).includes(Status)) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: `Status must be one of the following: ${Object.values(StatusType).join(', ')}`
            });
        }

        // Check if the updated complaint type already exists (case-insensitive)
        if (ComplaintType) {
            const existingComplaintType = await ComplaintsTypeModel.findOne({
                _id: { $ne: id },
                ComplaintType: { $regex: new RegExp(`^${ComplaintType}$`, 'i') }
            });

            if (existingComplaintType) {
                return responseHandler.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Another ComplaintType with the same name already exists'
                });
            }
        }

        // Update fields
        complaintType.ComplaintType = ComplaintType || complaintType.ComplaintType;
        complaintType.Status = Status || complaintType.Status;
        complaintType.Description = Description || complaintType.Description;
        complaintType.UpdatedBy = loggedInId;

        // Save to the database
        await complaintType.save();

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Complaint Type updated successfully',
            data:complaintType
        });
    } catch (error) {
        console.error(error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// Delete Compliment Type by ID
export const deleteComplainType = async (req, res) => {
    const { id } = req.params;

    try {
        const complimentType = await ComplaintsTypeModel.findByIdAndDelete(id);

        if (!complimentType) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Compliment Type not found'
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Compliment Type deleted successfully'
        });
    } catch (error) {
        console.error(error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// Create complain by admin
export const createComplaintByAdmin = async (req, res) => {
    const loggedInId = req['decodedToken']?.id;

    const {
        DeliveryId,
        UserId,
        ComplaintTypeId,
        Status = 'active',
        Description,
    } = req.body;

    if (!loggedInId) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'Forbidden'
        });
    }

    try {

        const isValidDeliveryComplain = await DeliveryModel.findById({_id:DeliveryId });

        if(!isValidDeliveryComplain){
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Delivery Does not exist'
            });

        }

        // Check if a complaint already exists for the same DeliveryId
        const existingComplaint = await ComplaintModel.findOne({ DeliveryId });

        if (existingComplaint) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'A complaint already exists for this delivery'
            });
        }

        const newComplaint = new ComplaintModel({
            DeliveryId,
            UserId,
            ComplaintTypeId,
            Status,
            Description,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId // Assuming initially UpdatedBy is the same as CreatedBy
        });

        await newComplaint.save();

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: 'Complaint created successfully',
            data:newComplaint
        });
    } catch (error) {
        console.error(error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// Update complain by admin
export const updateComplaintByAdmin = async (req, res) => {
    const { id } = req.params;
    const loggedInId = req['decodedToken']?.id;

    const {
        DeliveryId,
        UserId,
        ComplaintTypeId,
        Status,
        Description,
    } = req.body;

    try {
        const complaint = await ComplaintModel.findById(id);

        if (!complaint) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Complaint not found'
            });
        }

        // Update fields if they are provided
        if (DeliveryId) complaint.DeliveryId = DeliveryId;
        if (UserId) complaint.UserId = UserId;
        if (ComplaintTypeId) complaint.ComplaintTypeId = ComplaintTypeId;
        if (Status) complaint.Status = Status;
        if (Description !== undefined) complaint.Description = Description;
        complaint.UpdatedBy = loggedInId;

        await complaint.save();

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Complaint updated successfully',
            data:complaint
        });
    } catch (error) {
        console.error(error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

//Delete complain by admin
export const deleteComplaint = async (req, res) => {
    const { id } = req.params;

    try {
        const complaint = await ComplaintModel.findByIdAndDelete(id);

        if (!complaint) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Complaint not found'
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Complaint deleted successfully'
        });
    } catch (error) {
        console.error(error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// Get all complains by admin
export const getAllComplaintsByAdmin = async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        const complaints = await ComplaintModel.find()
        .skip(skip)
        .limit(limit)
        .populate('UserId', 'FirstName LastName Email Phone')
        .populate('ComplaintTypeId', 'ComplaintType')
        .populate('DeliveryId', 'DeliveryDate DeliveryTime ')

        const total = await ComplaintModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;


        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Complaints fetched successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                complaints,
            }
        });
    } catch (error) {
        console.error(error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

// Resolve complains by admin


// create complain by user
export const createComplaintByUser = async (req, res) => {
    const loggedInId = req['userId'];

    const {
        DeliveryId,
        ComplaintTypeId,
        Status = 'active',
        Description,
    } = req.body;

    if (!loggedInId) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'Forbidden'
        });
    }

    try {
        // Check if a complaint already exists for the same DeliveryId
        const existingComplaint = await ComplaintModel.findOne({ DeliveryId });

        if (existingComplaint) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'A complaint already exists for this delivery'
            });
        }

        const newComplaint = new ComplaintModel({
            DeliveryId,
            UserId:loggedInId,
            ComplaintTypeId,
            Status,
            Description,
            CreatedBy: loggedInId,
            UpdatedBy: loggedInId // Assuming initially UpdatedBy is the same as CreatedBy
        });

        await newComplaint.save();

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: 'Complaint created successfully',
            data:newComplaint
        });
    } catch (error) {
        console.error(error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};