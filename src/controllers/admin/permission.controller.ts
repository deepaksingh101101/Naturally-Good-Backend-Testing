import { Request, Response } from 'express';
import PermissionModel, { Permission } from '../../models/permission.model';
import { responseHandler } from '../../utils/send-response';

// Service class for handling CRUD operations on the Permission model
class PermissionService {
    // Create a new permission
    async createPermission(data: Partial<Permission>): Promise<Permission> {
        const permission = new PermissionModel(data);
        return await permission.save();
    }

    // Get all permissions
    async getPermissions(): Promise<Permission[]> {
        return await PermissionModel.find();
    }

    // Get a single permission by ID
    async getPermissionById(id: string): Promise<Permission | null> {
        return await PermissionModel.findById(id);
    }

    // Update a permission by ID
    async updatePermission(id: string, data: Partial<Permission>): Promise<Permission | null> {
        return await PermissionModel.findByIdAndUpdate(id, data, { new: true });
    }

    // Delete a permission by ID
    async deletePermission(id: string): Promise<Permission | null> {
        return await PermissionModel.findByIdAndDelete(id);
    }
}

// Instantiate the service class
const permissionService = new PermissionService();

// Controller functions for handling HTTP requests

// Create a new permission
export const createPermission = async (req: Request, res: Response) => {
    const permissions = req.body;

    // Validate that body is an array
    if (!Array.isArray(permissions)) {
        // return res.status(400).json({ error: 'Request body must be an array of permissions' });
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: "Request body must be an array of permissions!!",
        });
    }

    try {
        // Bulk insert permissions
        const result = await PermissionModel.insertMany(permissions);
        // res.status(201).json({ message: 'Permissions created successfully', data: result });
        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Permissions created successfully!!",
        });
    } catch (error) {
        console.error('Error creating permissions:', error);
        // res.status(500).json({ error: 'Internal server error', details: error.message });
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: "Internal Server Error!!",
            data: error.message
        });
    }
};

// Get all permissions
export const getPermissions = async (_req: Request, res: Response) => {
    try {
        const permissions = await permissionService.getPermissions();
        res.status(200).json({ data: permissions });
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Get a single permission by ID
export const getPermissionById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const permission = await permissionService.getPermissionById(id);

        if (!permission) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        res.status(200).json({ data: permission });
    } catch (error) {
        console.error('Error fetching permission:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Update a permission by ID
export const updatePermission = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { moduleName, permissions } = req.body;

    try {
        // Validate request body
        if (!moduleName || !Array.isArray(permissions)) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const updatedPermission = await permissionService.updatePermission(id, { moduleName, permissions });

        if (!updatedPermission) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        res.status(200).json({ message: 'Permission updated successfully', data: updatedPermission });
    } catch (error) {
        console.error('Error updating permission:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Delete a permission by ID
export const deletePermission = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedPermission = await permissionService.deletePermission(id);

        if (!deletedPermission) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        res.status(200).json({ message: 'Permission deleted successfully' });
    } catch (error) {
        console.error('Error deleting permission:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
