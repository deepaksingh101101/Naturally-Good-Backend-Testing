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
exports.searchUser = exports.searchEmployee = exports.getPermissionByEmployeeId = exports.editEmployeeById = exports.getEmployeeById = exports.getAllEmployees = exports.loginEmployee = exports.createEmployee = exports.createSuperAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const employee_model_1 = __importDefault(require("../../models/employee.model"));
const permission_model_1 = __importDefault(require("../../models/permission.model"));
const send_response_1 = require("../../utils/send-response");
const config_1 = require("../../config");
const createSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email, Password, FirstName, LastName, PhoneNumber, Dob, Gender, StreetAddress, City, State } = req.body;
    try {
        // Check if the "Superadmin" role already exists (case insensitive)
        let superadminRole = yield role_model_1.default.findOne({
            roleName: { $regex: new RegExp(`^Superadmin$`, 'i') }
        });
        // If the role doesn't exist, create it
        if (!superadminRole) {
            const permissions = yield permission_model_1.default.find();
            // Map permissions with `isAllowed` set to false
            const mappedPermissions = permissions.map(per => ({
                permission: per._id,
                icon: per.icon,
                details: per.permissions.map(perm => ({
                    isAllowed: true, // Set `isAllowed` to false for each permission
                    actionName: perm.name,
                    href: perm.href,
                    isInSidebar: perm.isInSidebar,
                }))
            }));
            superadminRole = new role_model_1.default({
                roleName: "Superadmin",
                permissions: mappedPermissions,
            });
            // Save the new role
            yield superadminRole.save();
        }
        // Check if an employee with the provided email already exists
        const employeeExists = yield employee_model_1.default.findOne({ Email });
        if (employeeExists) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Email already exists",
            });
            // return res.status(400).json({ error: 'Email already exists' });
        }
        // Check Super admin exist or not 
        const isSuperAdminExists = yield employee_model_1.default.findOne({
            Role: superadminRole._id,
        });
        if (isSuperAdminExists) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "One Super admin already exist",
            });
            // return res.status(400).json({ error: 'Email already exists' });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(Password, 10);
        // Create a new employee with the "Superadmin" role
        const newEmployee = new employee_model_1.default({
            Email,
            Password: hashedPassword,
            FirstName,
            LastName,
            PhoneNumber,
            Dob,
            Gender,
            StreetAddress,
            City,
            State,
            Role: superadminRole._id, // Assign the "Superadmin" role ID
        });
        // Save the new employee
        yield newEmployee.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Superadmin created successfully",
        });
        // res.status(201).json({ message: 'Superadmin created successfully' });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.createSuperAdmin = createSuperAdmin;
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { Email, Password, FirstName, LastName, PhoneNumber, Dob, Gender, StreetAddress, City, State, RoleId } = req.body;
    const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
    if (!loggedInId) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Invalid Login user",
        });
        // return res.status(400).json({ error: 'Invalid Login user' });
    }
    try {
        const role = yield role_model_1.default.findById(RoleId);
        if (!role) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Invalid Role",
            });
            // return res.status(400).json({ error: 'Invalid Role' });
        }
        const employeeExists = yield employee_model_1.default.findOne({ Email });
        if (employeeExists) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 409,
                message: "Employee already exists",
            });
            // return res.status(400).json({ error: 'Employee already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(Password, 10);
        const newEmployee = new employee_model_1.default({
            Email,
            Password: hashedPassword,
            FirstName,
            LastName,
            PhoneNumber,
            Dob,
            Gender,
            StreetAddress,
            City,
            State,
            CreatedBy: loggedInId,
            Role: RoleId,
        });
        yield newEmployee.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Employee created",
        });
        // res.status(201).json({ message: 'Employee created successfully' });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.createEmployee = createEmployee;
const loginEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email, Password } = req.body;
    try {
        const employee = yield employee_model_1.default.findOne({ Email });
        if (!employee) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 401,
                message: "Invalid email",
            });
            // return res.status(400).json({ error: 'Invalid email' });
        }
        const isPasswordValid = yield employee.validatePassword(Password);
        if (!isPasswordValid) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 401,
                message: "Invalid password",
            });
            // return res.status(400).json({ error: 'Invalid password' });
        }
        const token = (0, config_1.generateToken)({ id: employee._id, email: employee.Email, role: employee.Role });
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Login successful",
            data: token,
        });
        // res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.loginEmployee = loginEmployee;
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the role ID for 'Superadmin'
        const superadminRole = yield role_model_1.default.findOne({ roleName: 'Superadmin' }).exec();
        if (!superadminRole) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Superadmin role not found",
            });
            // return res.status(400).json({ error: 'Superadmin role not found' });
        }
        const roleIdToExclude = superadminRole._id; // Extract the role ID to exclude
        const currentPage = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (currentPage - 1) * limit;
        // Fetch employees excluding the ones with the 'Superadmin' role
        const employees = yield employee_model_1.default.find({ Role: { $ne: roleIdToExclude } })
            .skip(skip)
            .limit(limit)
            .select('-Password') // Exclude the Password field
            .populate({
            path: 'CreatedBy',
            select: '-Password' // Exclude sensitive fields from CreatedBy
        })
            .populate({ path: "Role", select: "roleName" })
            .exec();
        const total = yield employee_model_1.default.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Employees fetched successfully",
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                employees,
            }
        });
        // res.status(200).json(employees);
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.getAllEmployees = getAllEmployees;
const getEmployeeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get employee ID from the request parameters
    try {
        // Find the employee by ID, excluding the Password field
        const employee = yield employee_model_1.default.findById(id)
            .select('-Password') // Exclude the Password field
            .populate({
            path: 'CreatedBy',
            select: '-Password' // Exclude sensitive fields from CreatedBy
        })
            .populate({
            path: 'UpdatedBy',
            select: '-Password' // Exclude sensitive fields from CreatedBy
        })
            .populate({
            path: 'Role', // Populate the Role field
            select: 'roleName' // Exclude sensitive fields from CreatedBy
        })
            .exec();
        if (!employee) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Employee not found",
            });
            // return res.status(404).json({ error: 'Employee not found' });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Employee Fetched Successfully",
            data: employee,
        });
        // res.status(200).json(employee);
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
        // res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.getEmployeeById = getEmployeeById;
const editEmployeeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params; // Get employee ID from the request parameters
    const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id; // Get the logged-in user ID from the decoded token
    try {
        // Find the employee by ID
        const employee = yield employee_model_1.default.findById(id);
        if (!employee) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Employee not found",
            });
        }
        // Extract new data from the request body
        const newData = req.body;
        // Check if the request body contains 'phone' or 'email'
        if (newData.PhoneNumber || newData.Email) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Cannot update phone number or email address",
            });
        }
        // Set the UpdatedBy field to the logged-in user's ID
        newData.UpdatedBy = loggedInId;
        // Update the employee's fields with the new data while preserving existing fields
        const updatedEmployee = yield employee_model_1.default.findByIdAndUpdate(id, { $set: newData }, { new: true, runValidators: true } // `new: true` returns the updated document
        );
        if (!updatedEmployee) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Failed to update employee",
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Employee updated successfully",
            data: updatedEmployee,
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
});
exports.editEmployeeById = editEmployeeById;
const getPermissionByEmployeeId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req['decodedToken']; // Get employee ID from the request parameters
    try {
        // Find the employee by ID
        const employee = yield employee_model_1.default.findById(id);
        if (!employee) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Employee not found",
            });
        }
        // Find the role associated with the employee
        const role = yield role_model_1.default.findById(employee.Role).populate({
            path: 'permissions.permission',
            model: permission_model_1.default, // Ensure that this is the correct path to the Permission model
            select: 'moduleName' // Only select the moduleName field
        });
        if (!role) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Role not found for this employee",
            });
        }
        // Extract permissions from the role with populated moduleName
        const permissions = role.permissions
            .map(permission => {
            // Type checking and casting to ensure it is populated
            if (permission.permission instanceof permission_model_1.default) {
                return {
                    permissionId: permission.permission._id, // Use populated permission's _id
                    moduleName: permission.permission.moduleName, // Select populated moduleName
                    icon: permission.icon,
                    details: permission.details
                        .filter(detail => detail.isAllowed) // Filter to include only allowed details
                        .map(detail => ({
                        actionName: detail.actionName,
                        isAllowed: detail.isAllowed,
                        href: detail.href,
                        isInSidebar: detail.isInSidebar
                    }))
                };
            }
            else {
                return null; // Or handle the case where it's not populated
            }
        })
            .filter(p => p !== null) // Filter out any nulls if any
            .filter(permission => permission.details.length > 0); // Ensure we only include permissions with allowed details
        // Return the permissions
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Permissions fetched successfully",
            data: { permissions: permissions,
                employee: employee
            }
        });
    }
    catch (error) {
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.getPermissionByEmployeeId = getPermissionByEmployeeId;
const searchEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const filters = req.query;
        const pipeline = [];
        // Pagination setup
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        // Filter based on term
        if (filters.term) {
            const term = filters.term;
            pipeline.push({
                $match: {
                    $or: [
                        { FirstName: { $regex: new RegExp(term, 'i') } },
                        { LastName: { $regex: new RegExp(term, 'i') } },
                        { PhoneNumber: { $regex: new RegExp(term, 'i') } },
                        { Email: { $regex: new RegExp(term, 'i') } }
                    ],
                },
            });
        }
        // Add pagination to the pipeline
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });
        // Execute the aggregation pipeline
        const employees = yield employee_model_1.default.aggregate(pipeline);
        // Count documents after filtering for total count
        const countPipeline = [...pipeline];
        countPipeline.pop(); // Remove limit stage for count
        countPipeline.pop(); // Remove skip stage for count
        const total = yield employee_model_1.default.aggregate([...countPipeline, { $count: 'total' }]);
        const totalCount = ((_a = total[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        const totalPages = Math.ceil(totalCount / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        if (employees.length === 0) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'No employees found matching the criteria.',
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Employees retrieved successfully',
            data: {
                total: totalCount,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                employees,
            },
        });
    }
    catch (error) {
        console.error(error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
});
exports.searchEmployee = searchEmployee;
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const filters = req.query;
        const pipeline = [];
        // Pagination setup
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (currentPage - 1) * limit;
        // Filter based on term
        if (filters.term) {
            const term = filters.term;
            pipeline.push({
                $match: {
                    $or: [
                        { FirstName: { $regex: new RegExp(term, 'i') } },
                        { LastName: { $regex: new RegExp(term, 'i') } },
                        { Phone: { $regex: new RegExp(term, 'i') } },
                        { Email: { $regex: new RegExp(term, 'i') } }
                    ],
                },
            });
        }
        // Add pagination to the pipeline
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });
        // Execute the aggregation pipeline
        const users = yield user_model_1.default.aggregate(pipeline);
        // Count documents after filtering for total count
        const countPipeline = [...pipeline];
        countPipeline.pop(); // Remove limit stage for count
        countPipeline.pop(); // Remove skip stage for count
        const total = yield user_model_1.default.aggregate([...countPipeline, { $count: 'total' }]);
        const totalCount = ((_a = total[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        const totalPages = Math.ceil(totalCount / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        if (users.length === 0) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'No user found matching the criteria.',
            });
        }
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Users retrieved successfully',
            data: {
                total: totalCount,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                users,
            },
        });
    }
    catch (error) {
        console.error(error);
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
});
exports.searchUser = searchUser;
