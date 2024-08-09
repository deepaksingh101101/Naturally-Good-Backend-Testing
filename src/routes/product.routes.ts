import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createProduct, deleteProduct, filterProducts, getAllProducts, getProductById, updateProduct } from '../controllers/admin/product.controllers';

const router = Router();

router.post('/', adminMiddleware, createProduct);
router.get('/' ,adminMiddleware, getAllProducts)
router.get('/:id',adminMiddleware, getProductById)
router.put('/:id', adminMiddleware, updateProduct)
router.delete('/:id',adminMiddleware , deleteProduct)
router.get('/filter',adminMiddleware,filterProducts)
// router.post('/updateProductCategory',updateProductCategory)

export default router;
