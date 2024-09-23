"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminIdMiddleware_1 = require("../middleware/adminIdMiddleware");
const plan_controllers_1 = require("../controllers/admin/plan.controllers");
const router = (0, express_1.Router)();
router.post('/create', adminIdMiddleware_1.adminMiddleware, plan_controllers_1.createPlan);
router.get('/get', adminIdMiddleware_1.adminMiddleware, plan_controllers_1.getAllPlans);
router.patch('/update', adminIdMiddleware_1.adminMiddleware, plan_controllers_1.updatePlan);
router.delete('/delete', adminIdMiddleware_1.adminMiddleware, plan_controllers_1.deletePlan);
router.get('/getById', adminIdMiddleware_1.adminMiddleware, plan_controllers_1.getPlanById);
exports.default = router;
