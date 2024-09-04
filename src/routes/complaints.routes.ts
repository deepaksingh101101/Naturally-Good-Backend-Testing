import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createComplaintType, deleteComplaintType, getAllComplaintsType, getComplaintTypeById, updateComplaintType } from '../controllers/admin/complaintType.controllers';

const router = Router();

router.post('/type', adminMiddleware,createComplaintType);
router.get('/types' ,adminMiddleware, getAllComplaintsType)
router.get('type/:id',adminMiddleware, getComplaintTypeById)
router.put('type/:id', adminMiddleware, updateComplaintType)
router.delete('type/:id',adminMiddleware , deleteComplaintType)

export default router;
