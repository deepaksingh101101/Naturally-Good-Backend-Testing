"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dropdown_controller_1 = require("../controllers/dropdown.controller");
const isRoleLogedIn_1 = require("../middleware/isRoleLogedIn");
const router = express_1.default.Router();
// Types routes
router.get('/productTypes', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.getTypes);
router.post('/productType', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.createProductType);
router.delete('/productType/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.deleteProductType);
router.put('/productType/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.editProductType);
// // Seasons routes
router.get('/seasons', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.getSeasons);
router.post('/season', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.createSeason);
router.delete('/season/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.deleteSeason);
router.put('/seasons/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.editSeason);
// // Rosters routes
router.get('/rosters', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.getRosters);
router.post('/roster', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.createRoster);
router.delete('/roster/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.deleteRoster);
router.put('/roster/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.editRoster);
// // Subscription Types routes
router.get('/subscriptiontypes', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.getSubscriptionTypes);
router.post('/subscriptiontype', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.createSubscriptionType);
router.delete('/subscriptiontype/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.deleteSubscriptionType);
router.put('/subscriptiontype/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.editSubscriptionType);
// // Frequency Types routes
router.get('/frequencytypes', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.getFrequencyTypes);
router.post('/frequencytype', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.createFrequencyType);
router.delete('/frequencytype/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.deleteFrequencyType);
router.put('/frequencytype/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.editFrequencyType);
// Get all sources of customers
router.get('/sourceofcustomers', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.getSourceOfCustomers);
// Create a new source of customer
router.post('/sourceofcustomer', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.createSourceOfCustomer);
// Delete a source of customer by ID
router.delete('/sourceofcustomer/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.deleteSourceOfCustomer);
// Edit a source of customer by ID
router.put('/sourceofcustomer/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.editSourceOfCustomer);
router.get('/typeofcustomers', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.getTypeOfCustomers);
// Create a new type of customer
router.post('/typeofcustomer', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.createTypeOfCustomer);
// Delete a type of customer by ID
router.delete('/typeofcustomer/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.deleteTypeOfCustomer);
// Edit a type of customer by ID
router.put('/typeofcustomer/:id', isRoleLogedIn_1.isRoleLoggedIn, dropdown_controller_1.editTypeOfCustomer);
// // Role Types routes
// router.get('/role-types', adminMiddleware,getAllRoles );
// router.post('/role-types', adminMiddleware, createRole);
// router.delete('/role-types/:id', adminMiddleware, deleteRole);
exports.default = router;
