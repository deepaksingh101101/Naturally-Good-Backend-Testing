import express from 'express';
import { createFrequencyType, createRoster, createSeason, createSubscriptionType, createType, deleteFrequencyType, deleteRoster, deleteSeason, deleteSubscriptionType, deleteType, getFrequencyTypes, getRosters, getSeasons, getSubscriptionTypes, getTypes } from '../controllers/dropdown.controller';
import { adminMiddleware } from '../middleware/adminIdMiddleware';

const router = express.Router();


// Types routes
router.get('/types', adminMiddleware, getTypes);
router.post('/types', adminMiddleware, createType);
router.delete('/types/:id', adminMiddleware, deleteType);

// Seasons routes
router.get('/seasons', adminMiddleware, getSeasons);
router.post('/seasons', adminMiddleware, createSeason);
router.delete('/seasons/:id', adminMiddleware, deleteSeason);

// Rosters routes
router.get('/rosters', adminMiddleware, getRosters);
router.post('/rosters', adminMiddleware, createRoster);
router.delete('/rosters/:id', adminMiddleware, deleteRoster);

// Subscription Types routes
router.get('/subscription-types', adminMiddleware, getSubscriptionTypes);
router.post('/subscription-types', adminMiddleware, createSubscriptionType);
router.delete('/subscription-types/:id', adminMiddleware, deleteSubscriptionType);

// Frequency Types routes
router.get('/frequency-types', adminMiddleware, getFrequencyTypes);
router.post('/frequency-types', adminMiddleware, createFrequencyType);
router.delete('/frequency-types/:id', adminMiddleware, deleteFrequencyType);
export default router;
