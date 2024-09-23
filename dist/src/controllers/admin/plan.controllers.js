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
exports.getPlanById = exports.getAllPlans = exports.updatePlan = exports.deletePlan = exports.createPlan = void 0;
const plan_model_1 = __importDefault(require("../../models/plan.model"));
const createPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AdminId = req['adminId'];
        const { SubscriptionPlan } = req.body;
        const existingPlan = yield plan_model_1.default.findOne({ SubscriptionPlan });
        if (existingPlan) {
            return res.status(400).json({ error: 'Subscription plan already exists' });
        }
        const plan = new plan_model_1.default(Object.assign(Object.assign({}, req.body), { createdBy: AdminId }));
        yield plan.save();
        res.status(201).json(plan);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.createPlan = createPlan;
const deletePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planId } = req.query;
        const plan = yield plan_model_1.default.findByIdAndDelete(planId);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }
        res.status(200).json({ message: 'Plan deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.deletePlan = deletePlan;
const updatePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planId } = req.query;
        const updateData = req.body;
        const plan = yield plan_model_1.default.findByIdAndUpdate(planId, updateData, { new: true, runValidators: true });
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }
        res.status(200).json({ message: 'Plan updated successfully', plan });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.updatePlan = updatePlan;
const getAllPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield plan_model_1.default.find();
        res.status(200).json(plans);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.getAllPlans = getAllPlans;
const getPlanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planId } = req.query;
        const plan = yield plan_model_1.default.findById(planId);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }
        res.status(200).json(plan);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.getPlanById = getPlanById;
