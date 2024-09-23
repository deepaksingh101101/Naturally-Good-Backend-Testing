"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const superadmin_controller_1 = require("../controllers/auth/superadmin.controller");
const router = (0, express_1.Router)();
router.post('/create', superadmin_controller_1.createSuperAdmin);
router.post('/login', superadmin_controller_1.loginSuperAdmin);
exports.default = router;
