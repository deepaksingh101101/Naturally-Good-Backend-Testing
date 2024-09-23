"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkPermission_1 = require("../middleware/checkPermission");
const complain_controllers_1 = require("../controllers/admin/complain.controllers");
const isUserLogedIn_1 = require("../middleware/isUserLogedIn");
const router = (0, express_1.Router)();
// For admin only
router.post('/type', (0, checkPermission_1.checkPermissions)('Create Complain Type'), complain_controllers_1.createComplainType);
router.get('/types', (0, checkPermission_1.checkPermissions)('View Complain Table'), complain_controllers_1.getAllComplainTypes);
router.put('/type/:id', (0, checkPermission_1.checkPermissions)('Edit Complain Type'), complain_controllers_1.updateComplainType);
router.get('/type/:id', (0, checkPermission_1.checkPermissions)('View Complain Table'), complain_controllers_1.getComplainTypeById);
router.delete('/type/:id', (0, checkPermission_1.checkPermissions)('Delete Complain Type'), complain_controllers_1.deleteComplainType);
router.post('/', (0, checkPermission_1.checkPermissions)('Create Complain'), complain_controllers_1.createComplaint);
router.get('/', (0, checkPermission_1.checkPermissions)('View Complain'), complain_controllers_1.getAllComplaintsByAdmin);
router.put('/:id', (0, checkPermission_1.checkPermissions)('Edit Complain'), complain_controllers_1.updateComplaint);
router.delete('/:id', (0, checkPermission_1.checkPermissions)('Delete Complain'), complain_controllers_1.deleteComplaint);
// Create Complain by user route (same function but different route)
router.post('/user', isUserLogedIn_1.isUserLoggedIn, complain_controllers_1.createComplaint);
// Pending
router.post('resolve/:id', (0, checkPermission_1.checkPermissions)('Resolve Complain'), complain_controllers_1.getComplainTypeById);
//get complains through complain id id
router.get('/:id', (0, checkPermission_1.checkPermissions)('View Complain'), complain_controllers_1.getComplaintById);
// Complain for a particular loggedin user 
router.get('/user/complains', isUserLogedIn_1.isUserLoggedIn, complain_controllers_1.getComplaintById);
exports.default = router;
