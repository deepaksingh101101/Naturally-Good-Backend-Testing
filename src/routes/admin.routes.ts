import { Router } from 'express';
import {  createAdmin } from '../controllers/auth/adminauth.controller';
import { superAdminMiddleware } from '../middleware/middleware';

const router = Router();

router.post('/create',superAdminMiddleware, createAdmin);

export default router;
