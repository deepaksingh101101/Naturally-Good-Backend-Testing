import express from 'express';
// import { createFrequencyType, createRole, createRoster, createSeason, createSubscriptionType, createType, deleteFrequencyType, deleteRole, deleteRoster, deleteSeason, deleteSubscriptionType, deleteType, getAllRoles, getFrequencyTypes, getRosters, getSeasons, getSubscriptionTypes, getTypes } from '../controllers/dropdown.controller';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createFrequencyType, createGroup, createPriority, createProductType, createRoster, createSeason, createSourceOfCustomer, createSubscriptionType, createTypeOfCustomer, deleteFrequencyType, deleteGroup, deletePriority, deleteProductType, deleteRoster, deleteSeason, deleteSourceOfCustomer, deleteSubscriptionType, deleteTypeOfCustomer, editFrequencyType, editProductType, editRoster, editSeason, editSourceOfCustomer, editSubscriptionType, editTypeOfCustomer, getFrequencyTypes, getGroups, getPrioritys, getRosters, getSeasons, getSourceOfCustomers, getSubscriptionTypes, getTypeOfCustomers, getTypes } from '../controllers/dropdown.controller';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';

const router = express.Router();


// Types routes
router.get('/productTypes', isRoleLoggedIn, getTypes);
router.post('/productType', isRoleLoggedIn, createProductType);
router.delete('/productType/:id', isRoleLoggedIn, deleteProductType);
router.put('/productType/:id', isRoleLoggedIn, editProductType);

// // Seasons routes
router.get('/seasons', isRoleLoggedIn, getSeasons);
router.post('/season', isRoleLoggedIn, createSeason);
router.delete('/season/:id', isRoleLoggedIn, deleteSeason);
router.put('/seasons/:id', isRoleLoggedIn, editSeason);

// // Rosters routes
router.get('/rosters', isRoleLoggedIn, getRosters);
router.post('/roster', isRoleLoggedIn, createRoster);
router.delete('/roster/:id', isRoleLoggedIn, deleteRoster);
router.put('/roster/:id', isRoleLoggedIn, editRoster);

// // Subscription Types routes
router.get('/subscriptiontypes', isRoleLoggedIn, getSubscriptionTypes);
router.post('/subscriptiontype', isRoleLoggedIn, createSubscriptionType);
router.delete('/subscriptiontype/:id', isRoleLoggedIn, deleteSubscriptionType);
router.put('/subscriptiontype/:id', isRoleLoggedIn, editSubscriptionType);



// // Frequency Types routes
router.get('/frequencytypes', isRoleLoggedIn, getFrequencyTypes);
router.post('/frequencytype', isRoleLoggedIn, createFrequencyType);
router.delete('/frequencytype/:id', isRoleLoggedIn, deleteFrequencyType);
router.put('/frequencytype/:id', isRoleLoggedIn, editFrequencyType);


// Get all sources of customers
router.get('/sourceofcustomers', isRoleLoggedIn, getSourceOfCustomers);

// Create a new source of customer
router.post('/sourceofcustomer', isRoleLoggedIn, createSourceOfCustomer);

// Delete a source of customer by ID
router.delete('/sourceofcustomer/:id', isRoleLoggedIn, deleteSourceOfCustomer);

// Edit a source of customer by ID
router.put('/sourceofcustomer/:id', isRoleLoggedIn, editSourceOfCustomer);



router.get('/typeofcustomers', isRoleLoggedIn, getTypeOfCustomers);

// Create a new type of customer
router.post('/typeofcustomer', isRoleLoggedIn, createTypeOfCustomer);

// Delete a type of customer by ID
router.delete('/typeofcustomer/:id', isRoleLoggedIn, deleteTypeOfCustomer);

// Edit a type of customer by ID
router.put('/typeofcustomer/:id', isRoleLoggedIn, editTypeOfCustomer);
// // Role Types routes
// router.get('/role-types', adminMiddleware,getAllRoles );
// router.post('/role-types', adminMiddleware, createRole);
// router.delete('/role-types/:id', adminMiddleware, deleteRole);




// Get all Priority of customers
router.get('/prioritys', isRoleLoggedIn, getPrioritys);

// Create a new Priority of product
router.post('/priority', isRoleLoggedIn, createPriority);

// Delete a Priority of product by ID
router.delete('/priority/:id', isRoleLoggedIn, deletePriority);



// Get all Priority of customers
router.get('/groups', isRoleLoggedIn, getGroups);

// Create a new Priority of product
router.post('/group', isRoleLoggedIn, createGroup);

// Delete a Priority of product by ID
router.delete('/group/:id', isRoleLoggedIn, deleteGroup);


export default router;
