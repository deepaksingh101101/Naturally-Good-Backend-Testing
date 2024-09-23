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
exports.LoginUserByGoogle = void 0;
const google_auth_library_1 = require("google-auth-library");
const user_model_1 = __importDefault(require("../../models/user.model"));
const send_response_1 = require("../../utils/send-response");
const config_1 = require("../../config");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID || '525557668529-0sv0893s4r5b5gqrh82d3f6ffqgsrg4e.apps.googleusercontent.com');
const JWT_SECRET = process.env.JWT_SECRET || 'NFC@#$@#@@EDCRWVG#R@R@F$#R#$';
const LoginUserByGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(400).json({ error: 'Token is required' });
            return;
        }
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID || '525557668529-0sv0893s4r5b5gqrh82d3f6ffqgsrg4e.apps.googleusercontent.com',
        });
        const payload = ticket.getPayload();
        if (!payload) {
            res.status(400).json({ error: 'Invalid token' });
            return;
        }
        const { email, given_name, family_name, picture } = payload;
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }
        let user = yield user_model_1.default.findOne({ email });
        if (!user) {
            user = new user_model_1.default({
                FirstName: given_name,
                LastName: family_name,
                Email: email,
                isUserVerified: true, // Default to false, user will need to verify
                LastLogin: new Date().toISOString(),
                Profile: picture,
            });
            const newUser = yield user.save();
            req['userId'] = newUser._id;
        }
        else {
            user.LastLogin = new Date().toISOString();
            req['userId'] = user._id;
            yield user.save();
        }
        // const jwtToken = jwt.sign(
        //     { id: user._id, email: email },
        //     JWT_SECRET,
        //     { expiresIn: '5h' }
        // );
        const jwtToken = (0, config_1.generateToken)({ id: user._id });
        send_response_1.responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Login successful',
            data: {
                jwtToken,
                userInfo: {
                    FirstName: given_name,
                    LastName: family_name,
                    Email: email,
                    Profile: picture
                }
            }
        });
    }
    catch (error) {
        send_response_1.responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
exports.LoginUserByGoogle = LoginUserByGoogle;
