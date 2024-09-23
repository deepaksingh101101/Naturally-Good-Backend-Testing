"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_controllers_1 = require("../controllers/admin/subscription.controllers");
const checkPermission_1 = require("../middleware/checkPermission");
const order_controllers_1 = require("../controllers/admin/order.controllers");
const isUserLogedIn_1 = require("../middleware/isUserLogedIn");
const router = (0, express_1.Router)();
// Create order for admin
router.post('/', (0, checkPermission_1.checkPermissions)('Create Order'), order_controllers_1.createOrderByAdmin);
router.get('/', (0, checkPermission_1.checkPermissions)('View Order'), order_controllers_1.getAllOrdersByAdmin);
router.get('/:id', (0, checkPermission_1.checkPermissions)('View Order'), order_controllers_1.getOrderByIdByAdmin);
router.put('/:id', (0, checkPermission_1.checkPermissions)('Edit Subscription'), subscription_controllers_1.updateSubscription);
router.put('/toggle/:id', (0, checkPermission_1.checkPermissions)('Subscription Availability'), subscription_controllers_1.updateSubscriptionStatus);
router.get('/filter', subscription_controllers_1.filterSubscriptions);
// User Route
router.get('/user', isUserLogedIn_1.isUserLoggedIn, order_controllers_1.getAllOrdersByUser);
exports.default = router;
