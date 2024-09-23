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
exports.loginSuperAdmin = exports.createSuperAdmin = void 0;
const superadmin_model_1 = __importDefault(require("../../models/superadmin.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingSuperAdmin = yield superadmin_model_1.default.findOne({});
        if (existingSuperAdmin) {
            return res.status(400).json({ error: 'SuperAdmin already exists' });
        }
        const superAdmin = new superadmin_model_1.default(req.body);
        yield superAdmin.save();
        res.status(201).json({ message: 'SuperAdmin created successfully' });
    }
    catch (error) {
        console.error('Error creating SuperAdmin:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.createSuperAdmin = createSuperAdmin;
const JWT_SECRET = process.env.JWT_SECRET || 'NFC@#$@#@@EDCRWVG#R@R@F$#R#$';
const loginSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email, Password } = req.body;
    try {
        const superAdmin = yield superadmin_model_1.default.findOne({ Email });
        if (!superAdmin) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        const isPasswordValid = yield superAdmin.validatePassword(Password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        const token = jsonwebtoken_1.default.sign({ id: superAdmin._id, email: superAdmin.Email, role: superAdmin.Role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.loginSuperAdmin = loginSuperAdmin;
