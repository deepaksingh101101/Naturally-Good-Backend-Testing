"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controllers_1 = require("../controllers/admin/product.controllers");
const checkPermission_1 = require("../middleware/checkPermission");
const router = (0, express_1.Router)();
router.post('/', (0, checkPermission_1.checkPermissions)('Create Product'), product_controllers_1.createProduct);
router.get('/', product_controllers_1.getAllProducts);
router.get('/filter', product_controllers_1.filterProducts);
router.get('/:id', product_controllers_1.getProductById);
router.put('/:id', (0, checkPermission_1.checkPermissions)('Edit Product'), product_controllers_1.updateProduct);
router.put('/toggleAvailability/:id', (0, checkPermission_1.checkPermissions)('Product Availability'), product_controllers_1.toggleProductAvailability);
// router.delete('/deleteOne/:id',checkPermissions('Create Product') , deleteProduct)
exports.default = router;
