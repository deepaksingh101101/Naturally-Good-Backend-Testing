import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createSubscription, deleteSubscription, filterSubscriptions, getAllSubscriptions, getSubscriptionById, updateSubscription } from '../controllers/admin/subscription.controllers';

const router = Router();

router.post('/create', adminMiddleware, createSubscription);
router.get('/getAll', adminMiddleware, getAllSubscriptions);
router.get('/getOne/:id', adminMiddleware, getSubscriptionById);
router.put('/updateOne/:id', adminMiddleware, updateSubscription);
router.delete('/deleteOne/:id', adminMiddleware, deleteSubscription);
router.get('/filter', filterSubscriptions);

export default router;
