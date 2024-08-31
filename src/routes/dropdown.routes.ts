import express from 'express';
// import { createFrequencyType, createRole, createRoster, createSeason, createSubscriptionType, createType, deleteFrequencyType, deleteRole, deleteRoster, deleteSeason, deleteSubscriptionType, deleteType, getAllRoles, getFrequencyTypes, getRosters, getSeasons, getSubscriptionTypes, getTypes } from '../controllers/dropdown.controller';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createFrequencyType, createProductType, createRoster, createSeason, createSourceOfCustomer, createSubscriptionType, createTypeOfCustomer, deleteFrequencyType, deleteProductType, deleteRoster, deleteSeason, deleteSourceOfCustomer, deleteSubscriptionType, deleteTypeOfCustomer, editFrequencyType, editProductType, editRoster, editSeason, editSourceOfCustomer, editSubscriptionType, editTypeOfCustomer, getFrequencyTypes, getRosters, getSeasons, getSourceOfCustomers, getSubscriptionTypes, getTypeOfCustomers, getTypes } from '../controllers/dropdown.controller';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';

const router = express.Router();


// Types routes
router.get('/getAllProductType', isRoleLoggedIn, getTypes);
router.post('/createProductType', isRoleLoggedIn, createProductType);
router.delete('/deleteProductType/:id', isRoleLoggedIn, deleteProductType);
router.put('/editProductType/:id', isRoleLoggedIn, editProductType);

// // Seasons routes
router.get('/getAllSeasons', isRoleLoggedIn, getSeasons);
router.post('/createSeasons', isRoleLoggedIn, createSeason);
router.delete('/deleteSeasons/:id', isRoleLoggedIn, deleteSeason);
router.put('/updateSeasons/:id', isRoleLoggedIn, editSeason);

// // Rosters routes
router.get('/getAllRosters', isRoleLoggedIn, getRosters);
router.post('/createRosters', isRoleLoggedIn, createRoster);
router.delete('/deleteRosters/:id', isRoleLoggedIn, deleteRoster);
router.put('/updateRosters/:id', isRoleLoggedIn, editRoster);

// // Subscription Types routes
router.get('/subscription-types', isRoleLoggedIn, getSubscriptionTypes);
router.post('/subscription-types', isRoleLoggedIn, createSubscriptionType);
router.delete('/subscription-types/:id', isRoleLoggedIn, deleteSubscriptionType);
router.put('/subscription-types/:id', isRoleLoggedIn, editSubscriptionType);

// // Frequency Types routes
router.get('/frequency-types', isRoleLoggedIn, getFrequencyTypes);
router.post('/frequency-types', isRoleLoggedIn, createFrequencyType);
router.delete('/frequency-types/:id', isRoleLoggedIn, deleteFrequencyType);
router.put('/frequency-types/:id', isRoleLoggedIn, editFrequencyType);


// Get all sources of customers
router.get('/source-of-customers', isRoleLoggedIn, getSourceOfCustomers);

// Create a new source of customer
router.post('/source-of-customers', isRoleLoggedIn, createSourceOfCustomer);

// Delete a source of customer by ID
router.delete('/source-of-customers/:id', isRoleLoggedIn, deleteSourceOfCustomer);

// Edit a source of customer by ID
router.put('/source-of-customers/:id', isRoleLoggedIn, editSourceOfCustomer);



router.get('/type-of-customers', isRoleLoggedIn, getTypeOfCustomers);

// Create a new type of customer
router.post('/type-of-customers', isRoleLoggedIn, createTypeOfCustomer);

// Delete a type of customer by ID
router.delete('/type-of-customers/:id', isRoleLoggedIn, deleteTypeOfCustomer);

// Edit a type of customer by ID
router.put('/type-of-customers/:id', isRoleLoggedIn, editTypeOfCustomer);
// // Role Types routes
// router.get('/role-types', adminMiddleware,getAllRoles );
// router.post('/role-types', adminMiddleware, createRole);
// router.delete('/role-types/:id', adminMiddleware, deleteRole);
export default router;
