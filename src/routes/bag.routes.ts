import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createBagByAdmin, deleteBag, filterBags, getAllBags, getOneBag, toggleBagStatus, updateBag } from '../controllers/admin/bag.controllers';
import { checkPermissions } from '../middleware/checkPermission';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';

const router = Router();

router.post('/', checkPermissions('Create Bag'),createBagByAdmin);
router.put('/:id', checkPermissions('Edit Bag'), updateBag)
router.get('/bags' , getAllBags)
router.get('/:id', getOneBag)
router.put('/toggleStatus/:id',checkPermissions('Bag Availability'), toggleBagStatus)
// router.delete('/deleteOne/:id',adminMiddleware , deleteBag)
router.get('/filter', filterBags);

export default router;
