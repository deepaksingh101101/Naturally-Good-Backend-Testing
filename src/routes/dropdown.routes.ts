import express from 'express';
import { createRoster, createSeason, createType, deleteRoster, deleteSeason, deleteType, getRosters, getSeasons, getTypes } from '../controllers/dropdown.controller';
import { adminMiddleware } from '../middleware/adminIdMiddleware';

const router = express.Router();

// Types routes
router.get('/types',adminMiddleware, getTypes);
router.post('/types',adminMiddleware, createType);
router.delete('/types/:id',adminMiddleware, deleteType);

// Season routes
router.get('/seasons',adminMiddleware, getSeasons);
router.post('/seasons',adminMiddleware, createSeason);
router.delete('/seasons/:id',adminMiddleware, deleteSeason);

// Roster routes
router.get('/rosters', getRosters,adminMiddleware);
router.post('/rosters', createRoster,adminMiddleware);
router.delete('/rosters/:id', deleteRoster,adminMiddleware);

export default router;
