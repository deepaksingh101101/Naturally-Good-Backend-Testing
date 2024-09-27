import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createSubscription, deleteSubscription, filterSubscriptions, getAllSubscriptions, getSubscriptionById, updateSubscription, updateSubscriptionStatus } from '../controllers/admin/subscription.controllers';
import { checkPermissions } from '../middleware/checkPermission';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';
import { createOrderByAdmin, getAllOrdersByAdmin, getAllOrdersByUser, getDeliveryChargeByUserId, getOrderByIdByAdmin } from '../controllers/admin/order.controllers';
import { isUserLoggedIn } from '../middleware/isUserLogedIn';
import { getDeliveryByDate } from '../controllers/admin/delivery.controllers';

const router = Router();

// Create order for admin
router.post('/', checkPermissions('Create Order'), createOrderByAdmin);
router.get('/', checkPermissions('View Order'), getDeliveryByDate);
router.get('/:id',checkPermissions('View Order'), getOrderByIdByAdmin);
router.put('/:id', checkPermissions('Edit Subscription'), updateSubscription);
router.get('/filter', filterSubscriptions);



// User Route
router.get('/user',isUserLoggedIn, getAllOrdersByUser);

export default router;
