import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createSubscription, deleteSubscription, filterSubscriptions, getAllSubscriptions, getSubscriptionById, updateSubscription, updateSubscriptionStatus } from '../controllers/admin/subscription.controllers';
import { checkPermissions } from '../middleware/checkPermission';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';
import { createOrderByAdmin, getAllOrdersByAdmin, getAllOrdersByUser, getDeliveryChargeByUserId, getOrderByIdByAdmin } from '../controllers/admin/order.controllers';
import { isUserLoggedIn } from '../middleware/isUserLogedIn';
import { getDeliveryByDate, getDeliveryById, getDeliveryDetails, UpdateDeliveryBag, UpdateDeliveryStatus } from '../controllers/admin/delivery.controllers';

const router = Router();

// Create order for admin
// router.post('/', checkPermissions('Create Order'), createOrderByAdmin);
router.get('/',checkPermissions('View Order'), getDeliveryById);
router.post('/list', checkPermissions('View Order'), getDeliveryByDate);
router.get('/details',checkPermissions('View Order'), getDeliveryDetails);
router.put('/:DeliveryId',checkPermissions('View Order'), UpdateDeliveryBag);
router.put('/status/:DeliveryId',checkPermissions('View Order'), UpdateDeliveryStatus);




// User Route
router.get('/user',isUserLoggedIn, getAllOrdersByUser);

export default router;
