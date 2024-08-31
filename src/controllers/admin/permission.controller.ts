import { Request, Response } from 'express';
import PermissionModel, { Permission } from '../../models/permission.model';
import { responseHandler } from '../../utils/send-response';
import path from 'path';
import fs from 'fs';

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

// File path to permissions JSON file
const PERMISSIONS_FILE_PATH = path.resolve(__dirname, '../../constant/permissions.json');

// Load permissions from JSON file
const loadPermissionsFromFile = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        fs.readFile(PERMISSIONS_FILE_PATH, 'utf8', (err, data) => {
            if (err) {
                return reject(new Error(`Failed to read permissions file: ${err.message}`));
            }
            try {
                const permissions = JSON.parse(data);
                resolve(permissions);
            } catch (parseError) {
                reject(new Error(`Failed to parse permissions file: ${parseError.message}`));
            }
        });
    });
};

// Controller functions for handling HTTP requests

// Create permissions
export const createPermission = async (req: Request, res: Response) => {
    try {
        // Load permissions from file
        const permissionsFromFile = await loadPermissionsFromFile();

        // Check if any permissions already exist
        const existingPermissions = await PermissionModel.find();

        if (existingPermissions.length > 0) {
            // Permissions already exist
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Permissions are already created. Cannot create new ones.',
            });
        }

        // Bulk insert permissions
        await PermissionModel.insertMany(permissionsFromFile);
        
        // Return success response
        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Permissions created successfully!',
        });

    } catch (error) {
        console.error('Error creating permissions:', error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error!',
            data: error.message
        });
    }
};

// Get all permissions
export const getPermissions = async (req: Request, res: Response) => {
    try {
        const permissions = await permissionService.getPermissions();
        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Permissions fetched successfully!',
            data: permissions
        });
    } catch (error) {
        console.error('Error fetching permissions:', error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error!',
            data: error.message
        });
    }
};

// Get a single permission by ID
export const getPermissionById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const permission = await permissionService.getPermissionById(id);

        if (!permission) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Permission not found',
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Permission fetched successfully!',
            data: permission
        });
    } catch (error) {
        console.error('Error fetching permission:', error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error!',
            data: error.message
        });
    }
};

// Update a permission by ID
export const updatePermission = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { moduleName, permissions } = req.body;

    if (!moduleName || !Array.isArray(permissions) || permissions.some(p => !p.name)) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'Invalid request body',
        });
    }

    try {
        const updatedPermission = await permissionService.updatePermission(id, { moduleName, permissions });

        if (!updatedPermission) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Permission not found',
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Permission updated successfully!',
            data: updatedPermission
        });
    } catch (error) {
        console.error('Error updating permission:', error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error!',
            data: error.message
        });
    }
};

// Delete a permission by ID
export const deletePermission = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedPermission = await permissionService.deletePermission(id);

        if (!deletedPermission) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Permission not found',
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Permission deleted successfully!',
        });
    } catch (error) {
        console.error('Error deleting permission:', error);
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error!',
            data: error.message
        });
    }
};
