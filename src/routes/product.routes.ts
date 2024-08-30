import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createProduct, deleteProduct, filterProducts, getAllProducts, getProductById, toggleProductAvailability, updateProduct } from '../controllers/admin/product.controllers';
import { checkPermissions } from '../middleware/checkPermission';

const router = Router();

router.post('/create', checkPermissions('Create Product'), createProduct);
router.get('/getAll' , getAllProducts)
router.get('/getOne/:id',getProductById)
router.put('/updateOne/:id', checkPermissions('Edit Product'), updateProduct)
router.put('/toggleAvailability/:id', checkPermissions('Product Availability'), toggleProductAvailability)
// router.delete('/deleteOne/:id',checkPermissions('Create Product') , deleteProduct)
router.get('/filter', filterProducts);

export default router;
