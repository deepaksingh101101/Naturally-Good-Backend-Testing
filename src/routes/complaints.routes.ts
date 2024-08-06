import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createComplaintType, deleteComplaintType, getAllComplaintsType, getComplaintTypeById, updateComplaintType } from '../controllers/admin/complaintType.controllers';

const router = Router();

router.post('/create', adminMiddleware,createComplaintType);
router.get('/allComplaintType' ,adminMiddleware, getAllComplaintsType)
router.get('/:id',adminMiddleware, getComplaintTypeById)
router.put('/:id', adminMiddleware, updateComplaintType)
router.delete('/:id',adminMiddleware , deleteComplaintType)

export default router;
