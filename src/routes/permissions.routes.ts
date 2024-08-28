import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware'; // Adjust the path as needed
import { superAdminMiddleware } from '../middleware/superadmin.middleware';
import { createPermission, deletePermission, getPermissionById, getPermissions, updatePermission } from '../controllers/admin/permission.controller';

const router = Router();

router.post('/createPermission', createPermission);
router.get('/getAllPermission', getPermissions);
router.get('/getOnePermission/:id', getPermissionById);
router.put('/updateOnePermission/:id', updatePermission);
router.delete('/deleteOnePermission/:id', deletePermission);

export default router;
