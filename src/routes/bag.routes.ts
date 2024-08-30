import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createBagByAdmin, deleteBag, filterBags, getAllBags, getOneBag, toggleBagStatus, updateBag } from '../controllers/admin/bag.controllers';
import { checkPermissions } from '../middleware/checkPermission';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';

const router = Router();

router.post('/create', checkPermissions('Create Bag'),createBagByAdmin);
router.put('/updateOne/:id', checkPermissions('Edit Bag'), updateBag)
router.get('/getAll' , getAllBags)
router.get('/getOne/:id', getOneBag)
router.put('/toggleStatus/:id',checkPermissions('Bag Availability'), toggleBagStatus)
// router.delete('/deleteOne/:id',adminMiddleware , deleteBag)
router.get('/filter', filterBags);

export default router;
