"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRolesNameAndId = exports.getAllRoles = exports.createRole = void 0;
const role_model_1 = __importDefault(require("../../models/role.model")); // Adjust the path as needed
const permission_model_1 = __importDefault(require("../../models/permission.model")); // Adjust the path as needed
const send_response_1 = require("../../utils/send-response");
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roleName } = req.body;
    const superAdminId = req['decodedToken'].id;
    if (!superAdminId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Unauthorized",
        });
    }
    // const superAdminId = "66d00c12bcecdc9aabfe3a91";
    try {
        // Check if the role already exists (case-insensitive)
        const trimmedRoleName = roleName.trim(); // Trim the roleName
        const existingRole = yield role_model_1.default.findOne({
            roleName: { $regex: new RegExp(`^${trimmedRoleName}$`, 'i') } // Use the trimmed role name
        });
        if (existingRole) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 403,
                message: "Role already exists",
            });
            // return res.status(400).json({ error: 'Role already exists' });
        }
        // Fetch all permissions
        const permissions = yield permission_model_1.default.find();
        // Map permissions with isAllowed set to false
        const mappedPermissions = permissions.map(per => ({
            permission: per._id,
            icon: per.icon,
            details: per.permissions.map(perm => {
                return {
                    // Assuming you want to map some properties from `permission`
                    isAllowed: false,
                    actionName: perm.name,
                    href: perm.href,
                    isInSidebar: perm.isInSidebar,
                };
            })
        }));
        // Create a new role with the mapped permissions
        const newRole = new role_model_1.default({
            roleName,
            permissions: mappedPermissions,
            createdBy: superAdminId // Assuming the role is created by a SuperAdmin
        });
        // Save the new role
        const role = yield newRole.save();
        // Respond after saving
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Role created successfully",
            data: role
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.createRole = createRole;
// Get All role
const getAllRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all roles from the database
        const roles = yield role_model_1.default.find({ roleName: { $ne: 'Superadmin' } })
            .exec();
        // Respond with the list of roles
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Role fetched successfully",
            data: roles
        });
        // return res.status(200).json({roles });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.getAllRoles = getAllRoles;
const getAllRolesNameAndId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all roles excluding those with the roleName "superadmin"
        const roles = yield role_model_1.default.find({ roleName: { $ne: 'Superadmin' } })
            .select('roleName _id')
            .exec();
        // Respond with the list of roles
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Roles fetched successfully",
            data: roles
        });
    }
    catch (error) {
        console.error(error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.getAllRolesNameAndId = getAllRolesNameAndId;
