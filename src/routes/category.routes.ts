import { Router } from 'express';
import { createCategory } from '../controllers/admin/category.controller';
import { adminMiddleware } from '../middleware/adminIdMiddleware';

const router = Router();

router.post('/create', adminMiddleware, createCategory);

export default router;
