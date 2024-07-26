import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createPlan, deletePlan, getAllPlans, getPlanById, updatePlan } from '../controllers/admin/plan.controllers';

const router = Router();

router.post('/create', adminMiddleware, createPlan);
router.get('/get', adminMiddleware, getAllPlans);
router.patch('/update', adminMiddleware, updatePlan);
router.delete('/delete', adminMiddleware, deletePlan);
router.get('/getById', adminMiddleware, getPlanById);

export default router;
