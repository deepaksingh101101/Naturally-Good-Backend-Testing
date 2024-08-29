import { Permission } from './../../models/permission.model';
import { Request, Response } from 'express';
import RoleModel from '../../models/role.model'; // Adjust the path as needed
import PermissionModel from '../../models/permission.model'; // Adjust the path as needed

export const createRole = async (req: Request, res: Response) => {
    const { roleName } = req.body;
    const superAdminId = req['decodedToken'].id;
console.log(superAdminId)
    try {
        // Check if the role already exists (case-insensitive)
        const existingRole = await RoleModel.findOne({
            roleName: { $regex: new RegExp(`^${roleName}$`, 'i') }
        });
        if (existingRole) {
            return res.status(400).json({ error: 'Role already exists' });
        }

        // Fetch all permissions
        const permissions = await PermissionModel.find();
        // Map permissions with isAllowed set to false
        const mappedPermissions = permissions.map(per => ({
            // permission: per._id, 
            details: per.permissions.map(perm => {
                return {
                    // Assuming you want to map some properties from `permission`
                    isAllowed: false,
                    id: perm._id ,
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
        return res.status(201).json({ message: 'Role created successfully', data: newRole });
        
    } catch (error) {
        console.error('Error creating role:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
