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
exports.handleUserFilter = exports.handleAdminFilter = exports.updateRole = exports.getRoleById = exports.getAllRole = exports.loginRole = exports.createRole = void 0;
const oldrole_model_1 = __importDefault(require("../../models/oldrole.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email, Password, FirstName, LastName, PhoneNumber, Role } = req.body;
    const SuperAdminId = req['decodedToken'].id;
    const validRoles = ['Admin', 'Subadmin'];
    if (Role && !validRoles.includes(Role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }
    try {
        const adminExists = yield oldrole_model_1.default.findOne({ Email });
        if (adminExists) {
            return res.status(400).json({ error: `${adminExists.Role} already exists` });
        }
        const newAdmin = new oldrole_model_1.default({
            Email,
            Password,
            FirstName,
            LastName,
            PhoneNumber,
            SuperAdminId,
            Role: Role || 'Admin',
            isActive: true
        });
        yield newAdmin.save();
        res.status(201).json({ message: `${newAdmin.Role} created successfully` });
    }
    catch (error) {
        console.error('Error creating Admin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.createRole = createRole;
const loginRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email, Password } = req.body;
    try {
        const admin = yield oldrole_model_1.default.findOne({ Email });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = yield admin.validatePassword(Password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({
            id: admin._id,
            Role: admin.Role
        }, JWT_SECRET, { expiresIn: '10h' });
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.loginRole = loginRole;
const getAllRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield oldrole_model_1.default.find().populate('Email');
        res.status(200).json(admins);
    }
    catch (error) {
        console.error('Error fetching Admins:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.getAllRole = getAllRole;
const getRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.params.adminId;
    try {
        const admin = yield oldrole_model_1.default.findById(adminId).populate('_id');
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json(admin);
    }
    catch (error) {
        console.error('Error fetching Admin by ID:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.getRoleById = getRoleById;
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { Password, FirstName, LastName, PhoneNumber, Role, isActive } = req.body;
    const validRoles = ['Admin', 'Subadmin'];
    if (Role && !validRoles.includes(Role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }
    try {
        const admin = yield oldrole_model_1.default.findById(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        if (Password)
            admin.Password = Password;
        if (FirstName)
            admin.FirstName = FirstName;
        if (LastName)
            admin.LastName = LastName;
        if (PhoneNumber)
            admin.PhoneNumber = PhoneNumber;
        if (Role)
            admin.Role = Role;
        if (typeof isActive === 'boolean')
            admin.isActive = isActive;
        yield admin.save();
        res.status(200).json({ message: `${admin.Role} updated successfully`, admin });
    }
    catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.updateRole = updateRole;
// Filter Admins
const handleAdminFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract query parameters from the request
        const { Email, FirstName, LastName, PhoneNumber, SuperAdminId, Role, isActive, createdAt, } = req.query;
        // Build the query object dynamically
        const query = {}; // Use 'any' for a dynamic object
        if (Email)
            query.Email = Email;
        if (FirstName)
            query.FirstName = FirstName;
        if (LastName)
            query.LastName = LastName;
        if (PhoneNumber)
            query.PhoneNumber = PhoneNumber;
        if (SuperAdminId)
            query.SuperAdminId = SuperAdminId;
        if (Role)
            query.Role = Role;
        if (isActive)
            query.isActive = isActive === 'true'; // Convert string 'true'/'false' to boolean
        if (createdAt)
            query.createdAt = createdAt;
        // Perform the query
        const admins = yield oldrole_model_1.default.find(query).select('-Password');
        // Return the results
        return res.status(200).json(admins);
    }
    catch (error) {
        // Handle any errors that occur
        console.error('Error handling filter:', error);
        return res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});
exports.handleAdminFilter = handleAdminFilter;
// Filter Users
const handleUserFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract query parameters from the request
        const { userName, firstname, lastname, phoneNo, email, accountStatus, lastLogin, } = req.query;
        // Build the query object dynamically
        const query = {};
        if (userName)
            query.userName = userName;
        if (firstname)
            query.firstname = firstname;
        if (lastname)
            query.lastname = lastname;
        if (phoneNo)
            query.phoneNo = phoneNo;
        if (email)
            query.email = email;
        if (accountStatus)
            query.accountStatus = accountStatus === 'true'; // Convert string 'true'/'false' to boolean
        if (lastLogin)
            query.lastLogin = lastLogin;
        // Perform the query
        const users = yield user_model_1.default.find(query).select('-password');
        // Return the results
        return res.status(200).json(users);
    }
    catch (error) {
        // Handle any errors that occur
        console.error('Error handling filter:', error);
        return res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});
exports.handleUserFilter = handleUserFilter;
// Filter Employee
// export const handleEmployeeFilter = async (req: Request, res: Response) => {
//     try {
//         // Extract query parameters from the request
//         const {
//             Email,
//             FirstName,
//             LastName,
//             PhoneNumber,
//             AdminId,
//             Role,
//             isActive,
//             CreatedAt,
//             UpdatedAt
//         } = req.query;
//         // Build the query object dynamically
//         const query: any = {};
//         if (Email) query.Email = Email;
//         if (FirstName) query.FirstName = FirstName;
//         if (LastName) query.LastName = LastName;
//         if (PhoneNumber) query.PhoneNumber = PhoneNumber;
//         if (AdminId) query.AdminId = AdminId;
//         if (Role) query.Role = Role;
//         if (isActive) query.isActive = isActive === 'true'; // Convert string 'true'/'false' to boolean
//         if (CreatedAt) query.CreatedAt = CreatedAt;
//         if (UpdatedAt) query.UpdatedAt = UpdatedAt;
//         // Perform the query
//         const deliveryGuys = await DeliveryGuyModel.find(query).select('-Password');
//         // Return the results
//         return res.status(200).json(deliveryGuys);
//     } catch (error) {
//         return res.status(500).json({ error: 'An error occurred while processing the request' });
//     }
// };
const JWT_SECRET = process.env.JWT_SECRET || 'NFC@#$@#@@EDCRWVG#R@R@F$#R#$';
