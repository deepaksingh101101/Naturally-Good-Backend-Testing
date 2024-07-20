import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createProduct, deleteProduct, filterProducts, getAllProducts, getProductById, updateProduct } from '../controllers/admin/product.controllers';

const router = Router();

router.post('/create', adminMiddleware, createProduct);
router.get('/allproduct' , getAllProducts)
router.get('/products/:id', getProductById)
router.put('/update/:id', adminMiddleware, updateProduct)
router.delete('/delete/:id',adminMiddleware , deleteProduct)
router.get('/filter',filterProducts)

export default router;
