import { Router } from 'express';
import { addPermissionsToAllRoles, createPermission, deletePermission, getPermissionById, getPermissions, updatePermission } from '../controllers/admin/permission.controller';

const router = Router();

router.post('/', createPermission);
router.post('/one', addPermissionsToAllRoles);
router.get('/', getPermissions);
router.get('/:id', getPermissionById);
router.put('/:id', updatePermission);
router.delete('/:id', deletePermission);

export default router;
