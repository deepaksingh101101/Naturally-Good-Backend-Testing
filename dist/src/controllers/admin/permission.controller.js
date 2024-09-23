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
exports.addPermissionsToAllRoles = exports.deletePermission = exports.updatePermission = exports.getPermissionById = exports.getPermissions = exports.createPermission = void 0;
const permission_model_1 = __importDefault(require("../../models/permission.model"));
const send_response_1 = require("../../utils/send-response");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const role_model_1 = __importDefault(require("../../models/role.model"));
// Service class for handling CRUD operations on the Permission model
class PermissionService {
    // Create a new permission
    createPermission(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const permission = new permission_model_1.default(data);
            return yield permission.save();
        });
    }
    // Get all permissions
    getPermissions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield permission_model_1.default.find();
        });
    }
    // Get a single permission by ID
    getPermissionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield permission_model_1.default.findById(id);
        });
    }
    // Update a permission by ID
    updatePermission(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield permission_model_1.default.findByIdAndUpdate(id, data, { new: true });
        });
    }
    // Delete a permission by ID
    deletePermission(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield permission_model_1.default.findByIdAndDelete(id);
        });
    }
}
// Instantiate the service class
const permissionService = new PermissionService();
// File path to permissions JSON file
const PERMISSIONS_FILE_PATH = path_1.default.resolve(__dirname, '../../constant/permissions.json');
// Load permissions from JSON file
const loadPermissionsFromFile = () => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(PERMISSIONS_FILE_PATH, 'utf8', (err, data) => {
            if (err) {
                return reject(new Error(`Failed to read permissions file: ${err.message}`));
            }
            try {
                const permissions = JSON.parse(data);
                resolve(permissions);
            }
            catch (parseError) {
                reject(new Error(`Failed to parse permissions file: ${parseError.message}`));
            }
        });
    });
};
// Controller functions for handling HTTP requests
// Create permissions
const createPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Load permissions from file
        const permissionsFromFile = yield loadPermissionsFromFile();
        // Check if any permissions already exist
        const existingPermissions = yield permission_model_1.default.find();
        if (existingPermissions.length > 0) {
            // Permissions already exist
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Permissions are already created. Cannot create new ones.',
            });
        }
        // Bulk insert permissions
        yield permission_model_1.default.insertMany(permissionsFromFile);
        // Return success response
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Permissions created successfully!',
        });
    }
    catch (error) {
        console.error('Error creating permissions:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error!',
            data: error.message
        });
    }
});
exports.createPermission = createPermission;
// Get all permissions
const getPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = yield permissionService.getPermissions();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Permissions fetched successfully!',
            data: permissions
        });
    }
    catch (error) {
        console.error('Error fetching permissions:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error!',
            data: error.message
        });
    }
});
exports.getPermissions = getPermissions;
// Get a single permission by ID
const getPermissionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const permission = yield permissionService.getPermissionById(id);
        if (!permission) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Permission not found',
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Permission fetched successfully!',
            data: permission
        });
    }
    catch (error) {
        console.error('Error fetching permission:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error!',
            data: error.message
        });
    }
});
exports.getPermissionById = getPermissionById;
// Update a permission by ID
const updatePermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { moduleName, permissions } = req.body;
    if (!moduleName || !Array.isArray(permissions) || permissions.some(p => !p.name)) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 400,
            message: 'Invalid request body',
        });
    }
    try {
        const updatedPermission = yield permissionService.updatePermission(id, { moduleName, permissions });
        if (!updatedPermission) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Permission not found',
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Permission updated successfully!',
            data: updatedPermission
        });
    }
    catch (error) {
        console.error('Error updating permission:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error!',
            data: error.message
        });
    }
});
exports.updatePermission = updatePermission;
// Delete a permission by ID
const deletePermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedPermission = yield permissionService.deletePermission(id);
        if (!deletedPermission) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Permission not found',
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Permission deleted successfully!',
        });
    }
    catch (error) {
        console.error('Error deleting permission:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error!',
            data: error.message
        });
    }
});
exports.deletePermission = deletePermission;
const addPermissionsToAllRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleName, permissions } = req.body;
    if (!moduleName || !permissions) {
        return res.status(400).json({
            status: false,
            message: 'moduleName and permissions are required in the request body.',
        });
    }
    try {
        // Step 1: Check if the module already exists
        const existingModule = yield permission_model_1.default.findOne({ moduleName: moduleName });
        if (existingModule) {
            // Step 1.1: If the module exists, check if any permissions already exist
            const existingPermissionNames = existingModule.permissions.map((perm) => perm.name);
            const duplicatePermissions = permissions.filter((perm) => existingPermissionNames.includes(perm.name));
            if (duplicatePermissions.length > 0) {
                return res.status(400).json({
                    status: false,
                    message: 'One or more permissions already exist in the module.',
                });
            }
            // Step 1.2: If the module exists but the specific permissions do not exist, add new permissions
            existingModule.permissions.push(...permissions);
            yield existingModule.save();
            return res.status(200).json({
                status: true,
                message: 'Permissions successfully added to existing module.',
            });
        }
        // Step 2: Check if any permissions already exist in any module
        const existingPermissions = yield permission_model_1.default.find({
            "permissions.name": { $in: permissions.map((perm) => perm.name) },
        });
        if (existingPermissions.length > 0) {
            return res.status(400).json({
                status: false,
                message: 'One or more permissions already exist in another module.',
            });
        }
        // Step 3: If no duplicates exist, create a new permission entry
        const newPermission = yield permission_model_1.default.create({
            moduleName: moduleName,
            permissions: permissions,
        });
        // Step 4: Prepare permissions for Role update
        const permissionsForRole = {
            permission: newPermission._id,
            icon: newPermission.icon,
            details: newPermission.permissions.map((p) => ({
                isAllowed: true, // Default isAllowed to true for now; will adjust for roles later
                actionName: p.name,
                href: p.href,
                isInSidebar: p.isInSidebar
            })),
        };
        // Step 5: Find all roles and update them with new permissions
        const roles = yield role_model_1.default.find(); // Get all roles
        if (roles.length > 0) {
            for (const role of roles) {
                // Set `isAllowed` to true only for "Superadmin" role
                const permissionsForThisRole = Object.assign(Object.assign({}, permissionsForRole), { details: permissionsForRole.details.map((detail) => (Object.assign(Object.assign({}, detail), { isAllowed: role.roleName === 'Superadmin', href: detail.href, isInSidebar: detail.isInSidebar }))) });
                role.permissions.push(permissionsForThisRole);
                yield role.save();
                console.log(`Permissions added to role: ${role.roleName}`);
            }
            return res.status(200).json({
                status: true,
                message: 'Permissions successfully added to all roles.',
            });
        }
        else {
            console.log('No roles found.');
            return res.status(404).json({
                status: false,
                message: 'No roles found to update.',
            });
        }
    }
    catch (error) {
        console.error('Error adding permissions to roles:', error.message);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});
exports.addPermissionsToAllRoles = addPermissionsToAllRoles;
