import express from 'express';
// import { createFrequencyType, createRole, createRoster, createSeason, createSubscriptionType, createType, deleteFrequencyType, deleteRole, deleteRoster, deleteSeason, deleteSubscriptionType, deleteType, getAllRoles, getFrequencyTypes, getRosters, getSeasons, getSubscriptionTypes, getTypes } from '../controllers/dropdown.controller';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createProductType, deleteProductType, editProductType, getTypes } from '../controllers/dropdown.controller';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';

const router = express.Router();


// Types routes
router.get('/getAllProductType', isRoleLoggedIn, getTypes);
router.post('/createProductType', isRoleLoggedIn, createProductType);
router.delete('/deleteProductType/:id', isRoleLoggedIn, deleteProductType);
router.put('/editProductType/:id', isRoleLoggedIn, editProductType);

// // Seasons routes
// router.get('/seasons', adminMiddleware, getSeasons);
// router.post('/seasons', adminMiddleware, createSeason);
// router.delete('/seasons/:id', adminMiddleware, deleteSeason);

// // Rosters routes
// router.get('/rosters', adminMiddleware, getRosters);
// router.post('/rosters', adminMiddleware, createRoster);
// router.delete('/rosters/:id', adminMiddleware, deleteRoster);

// // Subscription Types routes
// router.get('/subscription-types', adminMiddleware, getSubscriptionTypes);
// router.post('/subscription-types', adminMiddleware, createSubscriptionType);
// router.delete('/subscription-types/:id', adminMiddleware, deleteSubscriptionType);

// // Frequency Types routes
// router.get('/frequency-types', adminMiddleware, getFrequencyTypes);
// router.post('/frequency-types', adminMiddleware, createFrequencyType);
// router.delete('/frequency-types/:id', adminMiddleware, deleteFrequencyType);


// // Role Types routes
// router.get('/role-types', adminMiddleware,getAllRoles );
// router.post('/role-types', adminMiddleware, createRole);
// router.delete('/role-types/:id', adminMiddleware, deleteRole);
export default router;
