import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createSubscription, deleteSubscription, filterSubscriptions, getAllSubscriptions, getSubscriptionById, searchSubscription, updateSubscription, updateSubscriptionStatus } from '../controllers/admin/subscription.controllers';
import { checkPermissions } from '../middleware/checkPermission';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';

const router = Router();

router.post('/', checkPermissions('Create Subscription'), createSubscription);
router.get('/search', searchSubscription);
router.get('/', isRoleLoggedIn, getAllSubscriptions);
router.get('/:id', isRoleLoggedIn, getSubscriptionById);
router.put('/:id', checkPermissions('Edit Subscription'), updateSubscription);
router.put('/toggle/:id', checkPermissions('Subscription Availability'), updateSubscriptionStatus);

export default router;
