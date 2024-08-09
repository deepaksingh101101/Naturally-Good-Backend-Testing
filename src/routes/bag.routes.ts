import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createBagByAdmin, deleteBag, filterBags, getAllBags, getOneBag, updateBag } from '../controllers/admin/bag.controllers';

const router = Router();

router.post('/create', adminMiddleware,createBagByAdmin);
router.get('/getAll' ,adminMiddleware, getAllBags)
router.get('/getOne/:id',adminMiddleware, getOneBag)
router.put('/updateOne/:id', adminMiddleware, updateBag)
router.delete('/deleteOne/:id',adminMiddleware , deleteBag)
router.get('/filter', filterBags);

export default router;
