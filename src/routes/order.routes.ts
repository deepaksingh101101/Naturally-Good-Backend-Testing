import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createSubscription, deleteSubscription, filterSubscriptions, getAllSubscriptions, getSubscriptionById, updateSubscription, updateSubscriptionStatus } from '../controllers/admin/subscription.controllers';
import { checkPermissions } from '../middleware/checkPermission';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';
import { createOrderByAdmin, getAllOrdersByAdmin, getAllOrdersByUser, getOrderByIdByAdmin } from '../controllers/admin/order.controllers';
import { isUserLoggedIn } from '../middleware/isUserLogedIn';

const router = Router();

// Create order for admin
router.post('/', checkPermissions('Create Order'), createOrderByAdmin);
router.get('/', checkPermissions('View Order'), getAllOrdersByAdmin);
router.get('/:id',checkPermissions('View Order'), getOrderByIdByAdmin);
router.put('/:id', checkPermissions('Edit Subscription'), updateSubscription);
router.put('/toggle/:id', checkPermissions('Subscription Availability'), updateSubscriptionStatus);
router.get('/filter', filterSubscriptions);



// User Route
router.get('/user',isUserLoggedIn, getAllOrdersByUser);

export default router;
