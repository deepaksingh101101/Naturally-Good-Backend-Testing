import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createSubscription, deleteSubscription, filterSubscriptions, getAllSubscriptions, getSubscriptionById, updateSubscription, updateSubscriptionStatus } from '../controllers/admin/subscription.controllers';
import { checkPermissions } from '../middleware/checkPermission';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';

const router = Router();

router.post('/create', checkPermissions('Create Subscription'), createSubscription);
router.get('/getAll', isRoleLoggedIn, getAllSubscriptions);
router.get('/getOne/:id', isRoleLoggedIn, getSubscriptionById);
router.put('/updateOne/:id', checkPermissions('Edit Subscription'), updateSubscription);
router.put('/toggle/:id', checkPermissions('Subscription Availability'), updateSubscriptionStatus);
router.get('/filter', filterSubscriptions);

export default router;
