import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon } from '../controllers/admin/coupons.controllers';
import { checkPermissions } from '../middleware/checkPermission';

const router = Router();

router.post('/create', checkPermissions('Create Coupons'), createCoupon);
router.get('/getAll', adminMiddleware, getAllCoupons);
router.get('/getOne/:id', adminMiddleware, getCouponById);
router.put('/updateOne/:id', adminMiddleware, updateCoupon);
router.delete('/deleteOne/:id', adminMiddleware, deleteCoupon);

export default router;
