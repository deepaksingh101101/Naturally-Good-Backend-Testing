"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bag_controllers_1 = require("../controllers/admin/bag.controllers");
const checkPermission_1 = require("../middleware/checkPermission");
const router = (0, express_1.Router)();
router.post('/', (0, checkPermission_1.checkPermissions)('Create Bag'), bag_controllers_1.createBagByAdmin);
router.put('/:id', (0, checkPermission_1.checkPermissions)('Edit Bag'), bag_controllers_1.updateBag);
router.get('/bags', bag_controllers_1.getAllBags);
router.get('/filter', bag_controllers_1.filterBags);
router.get('/:id', bag_controllers_1.getOneBag);
router.put('/toggleStatus/:id', (0, checkPermission_1.checkPermissions)('Bag Availability'), bag_controllers_1.toggleBagStatus);
// router.delete('/deleteOne/:id',adminMiddleware , deleteBag)
exports.default = router;
