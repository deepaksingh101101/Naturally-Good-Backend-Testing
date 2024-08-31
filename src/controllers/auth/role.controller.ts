import { Permission } from './../../models/permission.model';
import { Request, Response } from 'express';
import RoleModel from '../../models/role.model'; // Adjust the path as needed
import PermissionModel from '../../models/permission.model'; // Adjust the path as needed
import { responseHandler } from '../../utils/send-response';

export const createRole = async (req: Request, res: Response) => {
    const { roleName } = req.body;
    const superAdminId = req['decodedToken'].id;
    // const superAdminId = "66d00c12bcecdc9aabfe3a91";
    try {
        // Check if the role already exists (case-insensitive)
        const existingRole = await RoleModel.findOne({
            roleName: { $regex: new RegExp(`^${roleName}$`, 'i') }
        });
        if (existingRole) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Role already exists",
            });
            // return res.status(400).json({ error: 'Role already exists' });
        }

        // Fetch all permissions
        const permissions = await PermissionModel.find();
        // Map permissions with isAllowed set to false
        const mappedPermissions = permissions.map(per => ({
            permission: per._id, 
            details: per.permissions.map(perm => {
                return {
                    // Assuming you want to map some properties from `permission`
                    isAllowed: false,
                    actionName: perm.name,
                };
        })
        }));
        

        // Create a new role with the mapped permissions
        const newRole = new RoleModel({
            roleName,
            permissions: mappedPermissions,
            createdBy: superAdminId // Assuming the role is created by a SuperAdmin
        });

        // Save the new role
        await newRole.save();

        // Respond after saving
        return responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Role created successfully",
        });
        
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: "Internal Server Error"+ error.message,
        });
        // return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
// Get All role
export const getAllRoles = async (req: Request, res: Response) => {
    try {
        // Fetch all roles from the database
        const roles = await RoleModel.find()
            .exec();

        // Respond with the list of roles
        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Role fetched successfully",
            data:roles
        });
        // return res.status(200).json({roles });
        
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: "Internal Server Error" +error.message,
        });
        // return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

export const getAllRolesNameAndId = async (req: Request, res: Response) => {
    try {
        // Fetch all roles with only name and ID fields
        const roles = await RoleModel.find()
            .select('roleName _id')
            .exec();

        // Respond with the list of roles
        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Role fetched successfully",
            data:roles
        });
        // return res.status(200).json({ roles });
        
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: "Internal Server Error" +error.message,
        });
        // return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};