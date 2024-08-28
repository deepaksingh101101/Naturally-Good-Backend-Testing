import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon } from '../controllers/admin/coupons.controllers';

const router = Router();

router.post('/create', adminMiddleware, createCoupon);
router.get('/getAll', adminMiddleware, getAllCoupons);
router.get('/getOne/:id', adminMiddleware, getCouponById);
router.put('/updateOne/:id', adminMiddleware, updateCoupon);
router.delete('/deleteOne/:id', adminMiddleware, deleteCoupon);

export default router;
