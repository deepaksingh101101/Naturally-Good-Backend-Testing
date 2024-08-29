import { Router } from 'express';
import { 
  loginRole, updateRole, getRoleById, getAllRole, 
  handleAdminFilter, handleUserFilter 
} from '../controllers/auth/oldrole.controller';
import { verifyMiddleware } from '../middleware/superadmin.middleware';
import {  
  createEmployee,
  editEmployeeById,
  getAllEmployees,
  getEmployeeById,
  loginEmployee
} from '../controllers/admin/employee.controller';
import { createRole, getAllRoles } from '../controllers/auth/role.controller';
import { checkPermissions } from '../middleware/checkPermission';

const router = Router();

// Pass the specific action name as a parameter to the middleware
router.post('/createRole', checkPermissions('Create Role'), createRole);
router.get('/getAllRolesForPermissions', checkPermissions('View Role'), getAllRoles);
router.get('/getAllRolesIdAndName', getAllRoles);


router.post('/create/employee', checkPermissions('Create Employee'), createEmployee);
router.get('/employee',checkPermissions('View Employee') ,getAllEmployees);
router.get('/getOneEmployee/:id', checkPermissions('View Employee'), getEmployeeById);
router.put('/editEmployee/:id', checkPermissions('Edit Employee'), editEmployeeById);
router.get('/employee/login', loginEmployee);

export default router;
