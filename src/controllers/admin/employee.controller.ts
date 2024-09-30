import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../../models/user.model';
import RoleModel from '../../models/role.model';
import EmployeeModel, { Employee } from '../../models/employee.model';
import jwt from 'jsonwebtoken';
import { DocumentType } from '@typegoose/typegoose';
import PermissionModel from '../../models/permission.model';
import { responseHandler } from '../../utils/send-response';
import { generateToken } from '../../config';


export const createSuperAdmin = async (req: Request, res: Response) => {
    const { Email, Password, FirstName, LastName, PhoneNumber, Dob, Gender, StreetAddress, City, State } = req.body;


    try {


        
        // Check if the "Superadmin" role already exists (case insensitive)
        let superadminRole = await RoleModel.findOne({
            roleName: { $regex: new RegExp(`^Superadmin$`, 'i') }
        });

        // If the role doesn't exist, create it
        if (!superadminRole) {
            const permissions = await PermissionModel.find();

            // Map permissions with `isAllowed` set to false
            const mappedPermissions = permissions.map(per => ({
                permission: per._id,
                icon:per.icon,
                details: per.permissions.map(perm => ({
                    isAllowed: true, // Set `isAllowed` to false for each permission
                    actionName: perm.name,
                    href:perm.href,
                    isInSidebar:perm.isInSidebar,
                }))
            }));

            console.log("Hello"+mappedPermissions)


            superadminRole = new RoleModel({
                roleName: "Superadmin",
                permissions: mappedPermissions,
            });

            console.log(superadminRole)
            // Save the new role
            await superadminRole.save();
        }

        // Check if an employee with the provided email already exists
        const employeeExists = await EmployeeModel.findOne({ Email });

        if (employeeExists) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Email already exists",
            });
            // return res.status(400).json({ error: 'Email already exists' });
        }

        // Check Super admin exist or not 
        const isSuperAdminExists = await EmployeeModel.findOne({ 
            Role: superadminRole._id, });
        if (isSuperAdminExists) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "One Super admin already exist",
            });
            // return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create a new employee with the "Superadmin" role
        const newEmployee = new EmployeeModel({
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
        await newEmployee.save();

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Superadmin created successfully",
        });

        // res.status(201).json({ message: 'Superadmin created successfully' });
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
          });
        // res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const createEmployee = async (req: Request, res: Response) => {
    const { Email, Password, FirstName, LastName, PhoneNumber, Dob, Gender, StreetAddress, City, State, RoleId } = req.body;
    const loggedInId = req['decodedToken']?.id;

    if (!loggedInId) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 401,
            message: "Invalid Login user" ,
        });
        // return res.status(400).json({ error: 'Invalid Login user' });
    }
    try {
        const role = await RoleModel.findById(RoleId);
        if (!role) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Invalid Role" ,
            });
            // return res.status(400).json({ error: 'Invalid Role' });
        }

        const employeeExists = await EmployeeModel.findOne({ Email });
        if (employeeExists) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 409,
                message: "Employee already exists",
            });
            // return res.status(400).json({ error: 'Employee already exists' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const newEmployee = new EmployeeModel({
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

        await newEmployee.save();

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: "Employee created",
        });
        // res.status(201).json({ message: 'Employee created successfully' });
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
          });
        // res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

export const loginEmployee = async (req: Request, res: Response) => {
    const { Email, Password } = req.body;
    try {
        const employee = await EmployeeModel.findOne({ Email }) as DocumentType<Employee>;
        if (!employee) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 401,
                message: "Invalid email",
            });

            // return res.status(400).json({ error: 'Invalid email' });
        }

        const isPasswordValid = await employee.validatePassword(Password);
        if (!isPasswordValid) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 401,
                message: "Invalid password",
            });
            // return res.status(400).json({ error: 'Invalid password' });
        }

        const token = generateToken({ id: employee._id, email: employee.Email, role: employee.Role });

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Login successful",
            data:token,
        });
        // res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
          });
        // res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        // Find the role ID for 'Superadmin'
        const superadminRole = await RoleModel.findOne({ roleName: 'Superadmin' }).exec();
        if (!superadminRole) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Superadmin role not found",
            });
            // return res.status(400).json({ error: 'Superadmin role not found' });
        }

        const roleIdToExclude = superadminRole._id; // Extract the role ID to exclude

        const currentPage = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const skip = (currentPage - 1) * limit;

        // Fetch employees excluding the ones with the 'Superadmin' role
        const employees = await EmployeeModel.find({ Role: { $ne: roleIdToExclude } })
        .skip(skip)
        .limit(limit)
            .select('-Password') // Exclude the Password field
            .populate({
                path: 'CreatedBy',
                select: '-Password' // Exclude sensitive fields from CreatedBy
            })
            .populate({path:"Role",select:"roleName"})
            .exec();

            const total = await EmployeeModel.countDocuments();
            const totalPages = Math.ceil(total / limit);
      
            const prevPage = currentPage > 1;
            const nextPage = currentPage < totalPages;
      
            return responseHandler.out(req, res, {
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
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
          });
        // res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const getEmployeeById = async (req: Request, res: Response) => {
    const { id } = req.params; // Get employee ID from the request parameters

    try {
        // Find the employee by ID, excluding the Password field
        const employee = await EmployeeModel.findById(id)
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
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Employee not found",
    
            });
            // return res.status(404).json({ error: 'Employee not found' });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Employee Fetched Successfully",
            data:employee,

        });
        // res.status(200).json(employee);
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
          });
        // res.status(500).json({ error: 'Internal server error', details: error.message });

    }
};


export const editEmployeeById = async (req: Request, res: Response) => {
    const { id } = req.params; // Get employee ID from the request parameters
    const loggedInId = req['decodedToken']?.id; // Get the logged-in user ID from the decoded token

    try {
        // Find the employee by ID
        const employee = await EmployeeModel.findById(id);
        if (!employee) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Employee not found",
            });
        }

        // Extract new data from the request body
        const newData = req.body;

        // Check if the request body contains 'phone' or 'email'
        if (newData.PhoneNumber || newData.Email) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: "Cannot update phone number or email address",
            });
        }

        // Set the UpdatedBy field to the logged-in user's ID
        newData.UpdatedBy = loggedInId;

        // Update the employee's fields with the new data while preserving existing fields
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
            id,
            { $set: newData },
            { new: true, runValidators: true } // `new: true` returns the updated document
        );

        if (!updatedEmployee) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Failed to update employee",
            });
        }

        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Employee updated successfully",
            data: updatedEmployee,
        });
    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message,
        });
    }
};

export const getPermissionByEmployeeId = async (req: Request, res: Response) => {
    const id = req['decodedToken']; // Get employee ID from the request parameters
    try {
        // Find the employee by ID
  
        const employee = await EmployeeModel.findById(id) as DocumentType<Employee>;
        if (!employee) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Employee not found",
            });
        }

        // Find the role associated with the employee
        const role = await RoleModel.findById(employee.Role)
        .populate({
            path: 'permissions.permission',
            model: PermissionModel, // Ensure that this is the correct path to the Permission model
            select: 'moduleName' // Only select the moduleName field
        });

        if (!role) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: "Role not found for this employee",
            });
        }

        // Extract permissions from the role with populated moduleName
        const permissions = role.permissions
            .map(permission => {
                // Type checking and casting to ensure it is populated
                if (permission.permission instanceof PermissionModel) {
                    return {
                        permissionId: permission.permission._id, // Use populated permission's _id
                        moduleName: permission.permission.moduleName, // Select populated moduleName
                        icon:permission.icon,
                        details: permission.details
                            .filter(detail => detail.isAllowed) // Filter to include only allowed details
                            .map(detail => ({
                                actionName: detail.actionName,
                                isAllowed: detail.isAllowed,
                                href:detail.href,
                                isInSidebar:detail.isInSidebar
                            }))
                    };
                } else {
                    return null; // Or handle the case where it's not populated
                }
            })
            .filter(p => p !== null) // Filter out any nulls if any
            .filter(permission => permission.details.length > 0); // Ensure we only include permissions with allowed details

        // Return the permissions
        return responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: "Permissions fetched successfully bhai",
            data: {permissions:permissions,
                    employee:employee
            }
        });

    } catch (error) {
        return responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
};


export const searchEmployee = async (req: Request, res: Response) => {
    try {
        const filters = req.query;
        const pipeline: any[] = [];
        
        // Pagination setup
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        // Filter based on term
        if (filters.term) {
            const term = filters.term as string;
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
        const employees = await EmployeeModel.aggregate(pipeline);

        // Count documents after filtering for total count
        const countPipeline = [...pipeline];
        countPipeline.pop(); // Remove limit stage for count
        countPipeline.pop(); // Remove skip stage for count

        const total = await EmployeeModel.aggregate([...countPipeline, { $count: 'total' }]);
        const totalCount = total[0]?.total || 0;
        const totalPages = Math.ceil(totalCount / limit);

        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        if (employees.length === 0) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'No employees found matching the criteria.',
            });
        }

        responseHandler.out(req, res, {
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
    } catch (error) {
        console.error(error);
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
};


export const searchUser = async (req: Request, res: Response) => {
    try {
        const filters = req.query;
        const pipeline: any[] = [];
        
        // Pagination setup
        const currentPage = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (currentPage - 1) * limit;

        // Filter based on term
        if (filters.term) {
            const term = filters.term as string;
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
        const users = await UserModel.aggregate(pipeline);

        // Count documents after filtering for total count
        const countPipeline = [...pipeline];
        countPipeline.pop(); // Remove limit stage for count
        countPipeline.pop(); // Remove skip stage for count

        const total = await UserModel.aggregate([...countPipeline, { $count: 'total' }]);
        const totalCount = total[0]?.total || 0;
        const totalPages = Math.ceil(totalCount / limit);

        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;

        if (users.length === 0) {
            return responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'No user found matching the criteria.',
            });
        }

        responseHandler.out(req, res, {
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
    } catch (error) {
        console.error(error);
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
        });
    }
};
