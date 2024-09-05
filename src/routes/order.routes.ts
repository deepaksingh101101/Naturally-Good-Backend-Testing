import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createSubscription, deleteSubscription, filterSubscriptions, getAllSubscriptions, getSubscriptionById, updateSubscription, updateSubscriptionStatus } from '../controllers/admin/subscription.controllers';
import { checkPermissions } from '../middleware/checkPermission';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';
// import { createOrderByAdmin } from '../controllers/admin/order.controllers';

const router = Router();

// Create order for admin
// router.post('/', checkPermissions('Create Order'), createOrderByAdmin);
router.get('/', isRoleLoggedIn, getAllSubscriptions);
router.get('/:id', isRoleLoggedIn, getSubscriptionById);
router.put('/:id', checkPermissions('Edit Subscription'), updateSubscription);
router.put('/toggle/:id', checkPermissions('Subscription Availability'), updateSubscriptionStatus);
router.get('/filter', filterSubscriptions);

export default router;
