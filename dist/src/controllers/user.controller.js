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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllFeedback = exports.GetFeedbackByUserId = exports.DeleteFeedback = exports.UpdateFeedback = exports.CreateFeedback = exports.updateAccountStatusByAdmin = exports.updateUserByAdmin = exports.getUserByIdForAdmin = exports.getAllUserByAdmin = exports.createUserByAdmin = exports.verifyOTP = exports.sendOTP = void 0;
const twilio_1 = require("../../twilio");
const feedback_model_1 = __importDefault(require("../models/feedback.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const send_response_1 = require("../utils/send-response");
const config_1 = require("../config");
// import { OAuth2Client } from 'google-auth-library';
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '525557668529-0sv0893s4r5b5gqrh82d3f6ffqgsrg4e.apps.googleusercontent.com');
const JWT_SECRET = process.env.JWT_SECRET || 'NFC@#$@#@@EDCRWVG#R@R@F$#R#$';
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { PhoneNo } = req.body;
        if (!PhoneNo) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Phone number is required',
                data: null
            });
        }
        PhoneNo = PhoneNo.replace(/^\+91/, '');
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP expiry set to 15 minutes
        // Check if the user exists
        let user = yield user_model_1.default.findOne({ PhoneNo: PhoneNo });
        if (!user) {
            // If user does not exist, create a new user with the OTP and expiry
            user = yield user_model_1.default.create({
                PhoneNo: PhoneNo,
                Otp: otp.toString(),
                OtpExpiry: otpExpiry,
                isUserVerified: false, // Default to false, user will need to verify
            });
        }
        else {
            // If user exists, update the OTP and expiry
            user.Otp = otp.toString();
            user.OtpExpiry = otpExpiry;
            yield user.save();
        }
        // Send OTP via SMS
        yield twilio_1.client.messages.create({
            body: `Your verification code is ${otp}`,
            from: twilio_1.twilioNumber,
            to: `+91${PhoneNo}`
        });
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'OTP sent successfully',
            data: null
        });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: null
        });
    }
});
exports.sendOTP = sendOTP;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { PhoneNo, Otp } = req.body;
        if (!PhoneNo || !Otp) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Phone number and OTP are required',
                data: null
            });
        }
        PhoneNo = PhoneNo.replace(/^\+91/, '');
        // Find the user by phone number
        const user = yield user_model_1.default.findOne({ PhoneNo: PhoneNo });
        if (!user) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'User not found',
                data: null
            });
        }
        // Check if the OTP is correct and not expired
        if (user.Otp !== Otp) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Invalid OTP',
                data: null
            });
        }
        if (new Date() > user.OtpExpiry) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'OTP has expired',
                data: null
            });
        }
        // Update the user's verification status
        user.isUserVerified = true;
        user.Otp = undefined; // Clear OTP after successful verification
        user.OtpExpiry = undefined; // Clear OTP expiry after successful verification
        yield user.save();
        // Generate JWT token
        // const jwtToken = jwt.sign(
        //   { id: user._id },
        //   JWT_SECRET,
        //   { expiresIn: '5h' }
        // );
        const jwtToken = (0, config_1.generateToken)({ id: user._id });
        // Send the response
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'OTP verified successfully',
            data: {
                jwtToken,
                userId: user._id
            }
        });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: null
        });
    }
});
exports.verifyOTP = verifyOTP;
// Create user by admin side
const createUserByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get the logged-in admin ID from the decoded token
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        if (!loggedInId) {
            return res.status(401).json({
                status: false,
                statusCode: 401,
                message: 'Unauthorized',
                data: null
            });
        }
        // Extract user data from the request body
        const { FirstName, LastName, Phone, Address, Email, Profile, AlternateContactNumber, Allergies, NumberOfFamilyMembers, DOB, Height, Weight, Preferences, Gender, HowOftenYouCookedAtHome, WhatDoYouUsuallyCook, FamilyMembers, ExtraNotes, AssignedEmployee, Source, CustomerType, AlternateAddress } = req.body;
        if (!FirstName || !LastName || !Phone || !Address || !AssignedEmployee || !Source || !CustomerType) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Missing required fields',
                data: null
            });
        }
        // Check if the Phone number or Email already exists
        const existingPhoneNumber = yield user_model_1.default.findOne({ Phone });
        if (existingPhoneNumber) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Phone number already exists',
                data: null
            });
        }
        const existingEmailUser = yield user_model_1.default.findOne({ Email });
        if (existingEmailUser) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Email already exists',
                data: null
            });
        }
        // Create a new user object while ignoring some fields
        const newUser = new user_model_1.default({
            FirstName,
            LastName,
            Phone,
            Address,
            Email,
            Profile,
            AlternateContactNumber,
            Allergies,
            NumberOfFamilyMembers,
            DOB,
            Height,
            Weight,
            Preferences,
            Gender,
            HowOftenYouCookedAtHome,
            WhatDoYouUsuallyCook,
            FamilyMembers,
            ExtraNotes,
            AssignedEmployee,
            Source,
            CustomerType,
            AlternateAddress,
            CreatedBy: loggedInId, // Set the createdBy field to the admin's ID
            UpdatedBy: loggedInId // Optionally set the updatedBy field
        });
        // Save the new user to the database
        const savedUser = yield newUser.save();
        // Send a response with the newly created user
        return res.status(201).json({
            status: true,
            statusCode: 201,
            message: 'User created successfully',
            data: savedUser
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: error
        });
    }
});
exports.createUserByAdmin = createUserByAdmin;
const getAllUserByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get pagination parameters
        const currentPage = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (currentPage - 1) * limit;
        // Fetch users with pagination and populate necessary fields
        const users = yield user_model_1.default.find()
            .skip(skip)
            .limit(limit)
            .select('-Otp -OtpExpiry -Coupons') // Exclude OTP, OTP Expiry, Coupons fields
            .populate('AssignedEmployee', 'Name Email') // Adjust fields to populate as needed
            .populate('Source', 'Name')
            .populate('CustomerType', 'Name')
            .populate('CreatedBy', 'Email')
            .populate('UpdatedBy', 'Email');
        const total = yield user_model_1.default.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const prevPage = currentPage > 1;
        const nextPage = currentPage < totalPages;
        // Return the users in the response
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Users retrieved successfully',
            data: {
                total,
                currentPage,
                totalPages,
                prevPage,
                nextPage,
                users,
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: null
        });
    }
});
exports.getAllUserByAdmin = getAllUserByAdmin;
const getUserByIdForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id; // Extract user ID from request parameters
    try {
        // Validate the user ID
        if (!userId) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'User ID is required',
                data: null
            });
        }
        // Find the user by ID and populate all related fields
        const user = yield user_model_1.default.findById(userId)
            .populate({
            path: 'AssignedEmployee',
            select: 'FirstName LastName Email Phone' // Adjust fields as needed
        })
            .populate({
            path: 'Source',
            select: 'Name' // Adjust fields as needed
        })
            .populate({
            path: 'CustomerType',
            select: 'Name' // Adjust fields as needed
        })
            .populate({
            path: 'CreatedBy',
            select: '-Password',
            populate: {
                path: 'Role', // Adjust this if the role field is nested differently
                select: 'roleName' // Adjust according to the role fields you need
            }
        })
            .populate({
            path: 'UpdatedBy',
            select: '-Password',
            populate: {
                path: 'Role', // Adjust this if the role field is nested differently
                select: 'roleName' // Adjust according to the role fields you need
            }
        })
            .populate({
            path: 'Address.City', // Populate the City field inside Address
            select: 'CityName'
        })
            .exec();
        // Check if the user was found
        if (!user) {
            return res.status(404).json({
                status: false,
                statusCode: 404,
                message: 'User not found',
                data: null
            });
        }
        // Send a response with the user data
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'User retrieved successfully',
            data: user
        });
    }
    catch (error) {
        console.error('Error retrieving user:', error.message);
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: error.message
        });
    }
});
exports.getUserByIdForAdmin = getUserByIdForAdmin;
const updateUserByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get the logged-in admin ID from the decoded token
        const loggedInId = (_a = req['decodedToken']) === null || _a === void 0 ? void 0 : _a.id;
        if (!loggedInId) {
            return res.status(401).json({
                status: false,
                statusCode: 401,
                message: 'Unauthorized',
                data: null
            });
        }
        const userId = req.params.id; // Get user ID from URL parameters
        if (!userId) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'User ID is required',
                data: null
            });
        }
        // Extract the update data from the request body, excluding Phone and Email
        const _b = req.body, { Phone, Email } = _b, updateData = __rest(_b, ["Phone", "Email"]);
        if (Email || Phone) {
            return res.status(200).json({
                status: false,
                statusCode: 400,
                message: 'Email and Number Cannot be updated'
            });
        }
        // Find the user by ID and update with new data
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, Object.assign(Object.assign({}, updateData), { UpdatedBy: loggedInId // Update the updatedBy field
         }), { new: true } // Return the updated document
        );
        if (!updatedUser) {
            return res.status(404).json({
                status: false,
                statusCode: 404,
                message: 'User not found',
                data: null
            });
        }
        // Send a response with the updated user
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'User updated successfully',
            data: updatedUser
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: null
        });
    }
});
exports.updateUserByAdmin = updateUserByAdmin;
const updateAccountStatusByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id; // Get user ID from URL parameters
        const { AccountStatus } = req.body; // Get new account status from the request body
        if (!userId) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'User ID is required',
                data: null
            });
        }
        if (typeof AccountStatus !== 'boolean') {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Invalid account status',
                data: null
            });
        }
        // Update the AccountStatus field
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { AccountStatus }, { new: true } // Return the updated document
        );
        if (!updatedUser) {
            return res.status(404).json({
                status: false,
                statusCode: 404,
                message: 'User not found',
                data: null
            });
        }
        // Send a response with the updated user
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Account status updated successfully',
            data: updatedUser
        });
    }
    catch (error) {
        console.error('Error updating account status:', error);
        return res.status(500).json({
            status: false,
            statusCode: 500,
            message: 'Internal server error',
            data: null
        });
    }
});
exports.updateAccountStatusByAdmin = updateAccountStatusByAdmin;
// Create Feedback
const CreateFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUser = req['userId']; // Get user ID from request, ensure this is set correctly in your middleware
        const { Feedback, RatingValue, Order } = req.body;
        if (!Feedback || !RatingValue || Order) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Missing required values'
            });
        }
        const newFeedback = new feedback_model_1.default({
            CreatedBy: loggedInUser,
            UpdatedBy: loggedInUser,
            Feedback,
            Order,
            RatingValue
        });
        yield newFeedback.save();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 201,
            message: 'Feedback created successfully',
            data: newFeedback
        });
    }
    catch (error) {
        console.error('Error creating feedback:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.CreateFeedback = CreateFeedback;
// Update Feedback (by User)
const UpdateFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const { Feedback } = req.body;
        if (!Feedback) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 400,
                message: 'Feedback is required'
            });
        }
        const updatedFeedback = yield feedback_model_1.default.findByIdAndUpdate(id, { Feedback }, { new: true });
        if (!updatedFeedback) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Feedback not found'
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Feedback updated successfully',
            data: updatedFeedback
        });
    }
    catch (error) {
        console.error('Error updating feedback:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.UpdateFeedback = UpdateFeedback;
// Delete Feedback (by User)
const DeleteFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const deletedFeedback = yield feedback_model_1.default.findByIdAndDelete(id);
        if (!deletedFeedback) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'Feedback not found'
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Feedback deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting feedback:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.DeleteFeedback = DeleteFeedback;
// Get Feedback by User ID
const GetFeedbackByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req['userId']; // Get user ID from request
        const feedbacks = yield feedback_model_1.default.find({ CreatedBy: userId });
        if (!feedbacks.length) {
            return send_response_1.responseHandler.out(req, res, {
                status: false,
                statusCode: 404,
                message: 'No feedback found for this user'
            });
        }
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Feedbacks fetched successfully',
            data: feedbacks
        });
    }
    catch (error) {
        console.error('Error fetching feedbacks by user:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.GetFeedbackByUserId = GetFeedbackByUserId;
// Get All Feedback (for User and Admin)
const GetAllFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedbacks = yield feedback_model_1.default.find();
        return send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'All feedbacks fetched successfully',
            data: feedbacks
        });
    }
    catch (error) {
        console.error('Error fetching all feedbacks:', error);
        return send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal Server Error',
            data: error.message
        });
    }
});
exports.GetAllFeedback = GetAllFeedback;
