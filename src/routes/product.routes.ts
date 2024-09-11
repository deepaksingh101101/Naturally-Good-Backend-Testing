import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createProduct, deleteProduct, filterProducts, getAllProducts, getProductById, toggleProductAvailability, updateProduct } from '../controllers/admin/product.controllers';
import { checkPermissions } from '../middleware/checkPermission';

const router = Router();

router.post('/', checkPermissions('Create Product'), createProduct);
router.get('/' , getAllProducts)
router.get('/filter', filterProducts);
router.get('/:id',getProductById)
router.put('/:id', checkPermissions('Edit Product'), updateProduct)
router.put('/toggleAvailability/:id', checkPermissions('Product Availability'), toggleProductAvailability)
// router.delete('/deleteOne/:id',checkPermissions('Create Product') , deleteProduct)

export default router;
