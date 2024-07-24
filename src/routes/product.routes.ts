import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createProduct, deleteProduct, filterProducts, getAllProducts, getProductById, updateProduct, updateProductCategory } from '../controllers/admin/product.controllers';

const router = Router();

router.post('/create', adminMiddleware, createProduct);
router.get('/allproduct' , getAllProducts)
router.get('/products/:id', getProductById)
router.put('/update/:id', adminMiddleware, updateProduct)
router.delete('/delete/:id',adminMiddleware , deleteProduct)
router.get('/filter',filterProducts)
router.post('/updateProductCategory',updateProductCategory)

export default router;
