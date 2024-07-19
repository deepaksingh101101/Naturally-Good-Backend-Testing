import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createProduct } from '../controllers/admin/product.controllers';

const router = Router();

router.post('/create', adminMiddleware, createProduct);

export default router;
