import { Request, Response } from 'express';
import ComplimentsTypeModel from '../../models/complaintsType.model';

export const createComplaintType = async (req: Request, res: Response) => {
    try {
        const adminId = req['adminId'];
        const { ComplaintType } = req.body;

        // Check if the complaint type already exists
        const existingComplaint = await ComplimentsTypeModel.findOne({ ComplaintType });
        if (existingComplaint) {
            return res.status(400).json({ error: 'Complaint Type already exists' });
        }

        const complaint = new ComplimentsTypeModel({
            ...req.body,
            CreatedBy: adminId
        });

        await complaint.save();
        res.status(201).json({ message: 'Complaint Type created successfully', complaint });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Get all Complaint Types
export const getAllComplaintsType = async (req: Request, res: Response) => {
    try {
        const complaints = await ComplimentsTypeModel.find().populate({
            path: 'CreatedBy',
            select: '-Password' // Exclude the Password field
        });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Get a Complaint Type by ID
export const getComplaintTypeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const complaint = await ComplimentsTypeModel.findById(id).populate({
            path: 'CreatedBy',
            select: '-Password' // Exclude the Password field
        });

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint Type not found' });
        }

        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Update a Complaint Type by ID
export const updateComplaintType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedComplaint = await ComplimentsTypeModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedComplaint) {
            return res.status(404).json({ error: 'Complaint Type not found' });
        }

        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Delete a Complaint Type by ID
export const deleteComplaintType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedComplaint = await ComplimentsTypeModel.findByIdAndDelete(id);

        if (!deletedComplaint) {
            return res.status(404).json({ error: 'Complaint Type not found' });
        }

        res.status(200).json({ message: 'Complaint Type deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
