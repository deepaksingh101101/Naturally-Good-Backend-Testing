import { Router } from 'express';
import { 
  loginRole, updateRole, getRoleById, getAllRole, 
  handleAdminFilter, handleUserFilter 
} from '../controllers/auth/oldrole.controller';
import { verifyMiddleware } from '../middleware/superadmin.middleware';
import {  
  createEmployee,
  createSuperAdmin,
  editEmployeeById,
  filterEmployees,
  getAllEmployees,
  getEmployeeById,
  getPermissionByEmployeeId,
  loginEmployee
} from '../controllers/admin/employee.controller';
import { createRole, getAllRoles, getAllRolesNameAndId } from '../controllers/auth/role.controller';
import { checkPermissions } from '../middleware/checkPermission';
import { isRoleLoggedIn } from '../middleware/isRoleLogedIn';
import { createUserByAdmin, getAllUserByAdmin, getUserByIdForAdmin, updateAccountStatusByAdmin, updateUserByAdmin } from '../controllers/user.controller';

const router = Router();

// Pass the specific action name as a parameter to the middleware
router.post('/role', checkPermissions('Create Role'), createRole);
router.get('/rolesandpermission', checkPermissions('View Role'), getAllRoles);
router.get('/role',isRoleLoggedIn, getAllRolesNameAndId); //No permission added

// Super Admin Creation
router.post('/superadmin', createSuperAdmin);

// Employee Creation
router.post('/employee', checkPermissions('Create Employee'), createEmployee);
router.get('/employee/filter', checkPermissions('View Employee'), filterEmployees);
router.put('/employee/:id', checkPermissions('Edit Employee'), editEmployeeById);
router.get('/employee',checkPermissions('View Employee') ,getAllEmployees);
router.get('/employee/:id', checkPermissions('View Employee'), getEmployeeById);
router.post('/employee/login', loginEmployee);

router.get('/emplooyee/permission', isRoleLoggedIn,getPermissionByEmployeeId);

// User/Customer Creation By Admin
router.post('/user', checkPermissions('Create Customer'), createUserByAdmin);
router.get('/user',checkPermissions('View Customer') ,getAllUserByAdmin);
router.get('/user/:id', checkPermissions('View Customer'), getUserByIdForAdmin);
router.put('/user/:id', checkPermissions('Edit Customer'), updateUserByAdmin);
router.put('/user/toggle/:id', checkPermissions('Customer Status'), updateAccountStatusByAdmin);

export default router;
