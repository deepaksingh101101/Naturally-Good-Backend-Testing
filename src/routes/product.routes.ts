import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createProduct, deleteProduct, filterProducts, getAllProducts, getProductById, updateProduct } from '../controllers/admin/product.controllers';

const router = Router();

router.post('/create', adminMiddleware, createProduct);
router.get('/getAll' ,adminMiddleware, getAllProducts)
router.get('/getOne/:id',adminMiddleware, getProductById)
router.put('/updateOne/:id', adminMiddleware, updateProduct)
router.delete('/deleteOne/:id',adminMiddleware , deleteProduct)
router.get('/filter', filterProducts);
// router.post('/updateProductCategory',updateProductCategory)

export default router;
