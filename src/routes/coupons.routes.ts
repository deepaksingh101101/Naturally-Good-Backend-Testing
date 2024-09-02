import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon } from '../controllers/admin/coupons.controllers';
import { checkPermissions } from '../middleware/checkPermission';

const router = Router();

router.post('/create', checkPermissions('Create Coupons'), createCoupon);
router.get('/getAll', checkPermissions('View Coupons'), getAllCoupons);
router.get('/getOne/:id', checkPermissions("View Coupons"), getCouponById);
router.put('/updateOne/:id', checkPermissions('Edit Coupons'), updateCoupon);
router.delete('/deleteOne/:id',checkPermissions('Delete Coupons'), deleteCoupon);

export default router;
