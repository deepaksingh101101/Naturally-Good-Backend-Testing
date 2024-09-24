import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { AssignCouponsToCustomer, createCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon, updateCouponStatus } from '../controllers/admin/coupons.controllers';
import { checkPermissions } from '../middleware/checkPermission';

const router = Router();

router.post('/', checkPermissions('Create Coupons'), createCoupon);
router.put('/toggle/:id',checkPermissions('Toggle Coupons'), updateCouponStatus);
router.get('/', checkPermissions('View Coupons'), getAllCoupons);
router.get('/:id', checkPermissions("View Coupons"), getCouponById);
router.put('/:id', checkPermissions('Edit Coupons'), updateCoupon);
router.delete('/:id',checkPermissions('Delete Coupons'), deleteCoupon);
router.put('/assigncoupon/:id',checkPermissions('Assign Coupons'), AssignCouponsToCustomer);

export default router;
