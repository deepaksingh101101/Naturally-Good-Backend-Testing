import ComplaintsTypeModel, { StatusType } from "../../models/complaintsType.model";
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
        const complimentType = await ComplaintsTypeModel.findById(id);

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