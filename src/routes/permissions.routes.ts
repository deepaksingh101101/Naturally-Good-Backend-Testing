import { Router } from 'express';
import { adminMiddleware } from '../middleware/adminIdMiddleware'; // Adjust the path as needed
import { verifyMiddleware } from '../middleware/superadmin.middleware';
import { addPermissionsToAllRoles, createPermission, deletePermission, getPermissionById, getPermissions, updatePermission } from '../controllers/admin/permission.controller';

const router = Router();

router.post('/createPermission', createPermission);
router.post('/addNewPermissions', addPermissionsToAllRoles);
router.get('/getAllPermission', getPermissions);
router.get('/getOnePermission/:id', getPermissionById);
router.put('/updateOnePermission/:id', updatePermission);
router.delete('/deleteOnePermission/:id', deletePermission);

export default router;
