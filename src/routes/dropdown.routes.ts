import express from 'express';
// import { createFrequencyType, createRole, createRoster, createSeason, createSubscriptionType, createType, deleteFrequencyType, deleteRole, deleteRoster, deleteSeason, deleteSubscriptionType, deleteType, getAllRoles, getFrequencyTypes, getRosters, getSeasons, getSubscriptionTypes, getTypes } from '../controllers/dropdown.controller';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createProductType, createRoster, createSeason, deleteProductType, deleteRoster, deleteSeason, editProductType, editRoster, editSeason, getRosters, getSeasons, getTypes } from '../controllers/dropdown.controller';
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
