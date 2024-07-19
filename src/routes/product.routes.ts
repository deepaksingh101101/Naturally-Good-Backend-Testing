import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createProduct, getAllProducts, getProductById } from '../controllers/admin/product.controllers';

const router = Router();

router.post('/create', adminMiddleware, createProduct);
router.get('/allproduct' , getAllProducts)
router.get('/products/:id', getProductById)

export default router;
