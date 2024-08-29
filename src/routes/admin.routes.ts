import { Router } from 'express';
import { 
  loginRole, updateRole, getRoleById, getAllRole, 
  handleAdminFilter, handleUserFilter 
} from '../controllers/auth/oldrole.controller';
import { verifyMiddleware } from '../middleware/superadmin.middleware';
import {  
  createEmployee,
  getAllEmployees,
  loginEmployee
} from '../controllers/admin/employee.controller';
import { createRole } from '../controllers/auth/role.controller';
import { checkPermissions } from '../middleware/checkPermission';

const router = Router();

// Pass the specific action name as a parameter to the middleware
router.post('/createRole', checkPermissions('Create Role'), createRole);
router.post('/create/employee', checkPermissions('Create Employee'), createEmployee);
router.get('/employee', getAllEmployees);
router.get('/employee/login', loginEmployee);

export default router;
