import { Request, Response } from 'express';
import PermissionModel, { Permission } from '../../models/permission.model';
import { responseHandler } from '../../utils/send-response';
import path from 'path';
import fs from 'fs';
import RoleModel from '../../models/role.model';

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



export const addPermissionsToAllRoles = async (req: Request, res: Response) => {
    const { moduleName, permissions } = req.body as Permission;
  
    if (!moduleName || !permissions) {
      return res.status(400).json({
        status: false,
        message: 'moduleName and permissions are required in the request body.',
      });
    }
  
    try {
      // Step 1: Check if the module already exists
      const existingModule = await PermissionModel.findOne({ moduleName: moduleName });
  
      if (existingModule) {
        // Step 1.1: If the module exists, check if any permissions already exist
        const existingPermissionNames = existingModule.permissions.map((perm: any) => perm.name);
        const duplicatePermissions = permissions.filter((perm) => existingPermissionNames.includes(perm.name));
  
        if (duplicatePermissions.length > 0) {
          return res.status(400).json({
            status: false,
            message: 'One or more permissions already exist in the module.',
          });
        }
  
        // Step 1.2: If the module exists but the specific permissions do not exist, add new permissions
        existingModule.permissions.push(...permissions);
        await existingModule.save();
  
        return res.status(200).json({
          status: true,
          message: 'Permissions successfully added to existing module.',
        });
      }
  
      // Step 2: Check if any permissions already exist in any module
      const existingPermissions = await PermissionModel.find({
        "permissions.name": { $in: permissions.map((perm) => perm.name) },
      });
  
      if (existingPermissions.length > 0) {
        return res.status(400).json({
          status: false,
          message: 'One or more permissions already exist in another module.',
        });
      }
  
      // Step 3: If no duplicates exist, create a new permission entry
      const newPermission = await PermissionModel.create({
        moduleName: moduleName,
        permissions: permissions,
      });
  
      // Step 4: Prepare permissions for Role update
      const permissionsForRole = {
        permission: newPermission._id,
        icon:newPermission.icon,
        details: newPermission.permissions.map((p: any) => ({
          isAllowed: true, // Default isAllowed to true for now; will adjust for roles later
          actionName: p.name,
          href:p.href,
          isInSidebar:p.isInSidebar
        })),
      };
  
      // Step 5: Find all roles and update them with new permissions
      const roles = await RoleModel.find(); // Get all roles
  
      if (roles.length > 0) {
        for (const role of roles) {
          // Set `isAllowed` to true only for "Superadmin" role
          const permissionsForThisRole = {
            ...permissionsForRole,
            details: permissionsForRole.details.map((detail) => ({
              ...detail,
              isAllowed: role.roleName === 'Superadmin', // true if Superadmin, else false
              href:detail.href,
              isInSidebar:detail.isInSidebar
            })),
          };
  
          role.permissions.push(permissionsForThisRole);
          await role.save();
          console.log(`Permissions added to role: ${role.roleName}`);
        }
        return res.status(200).json({
          status: true,
          message: 'Permissions successfully added to all roles.',
        });
      } else {
        console.log('No roles found.');
        return res.status(404).json({
          status: false,
          message: 'No roles found to update.',
        });
      }
    } catch (error) {
      console.error('Error adding permissions to roles:', error.message);
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };
  
  
  
  