import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/admin/product.controllers';

const router = Router();

router.post('/create', adminMiddleware, createProduct);
router.get('/allproduct' , getAllProducts)
router.get('/products/:id', getProductById)
router.put('/update/:id', adminMiddleware, updateProduct)
router.delete('/delete/:id',adminMiddleware , deleteProduct)

export default router;
