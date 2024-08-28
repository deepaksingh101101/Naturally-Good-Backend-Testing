import { Router } from 'express';
import { 
  loginRole, updateRole, getRoleById, getAllRole, 
  handleAdminFilter, handleUserFilter 
} from '../controllers/auth/oldrole.controller';
import { superAdminMiddleware } from '../middleware/superadmin.middleware';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { 
  createDeliveryGuy, deliveryGuyLogin, getAllDeliveryGuys, updateDeliveryGuy, 
  getDeliveryGuyById, updateEmployeeStatus, updateUserStatus, assignEmployee 
} from '../controllers/admin/employee.controller';
import { createRole } from '../controllers/auth/role.controller';

const router = Router();

// router.post('/create', superAdminMiddleware, createRole);
router.post('/createRole', superAdminMiddleware, createRole);
// router.get("/getallrole", superAdminMiddleware, getAllRole);
// router.get("/getrolebyid/:adminId", superAdminMiddleware, getRoleById);
// router.put("/update/:id", updateRole);
// router.post("/rolelogin", loginRole);
router.post("/create/delivery", adminMiddleware, createDeliveryGuy);
router.post("/login/delivery", deliveryGuyLogin);
router.put('/update/delivery/:id', updateDeliveryGuy);
router.get('/getall/delivery', adminMiddleware, getAllDeliveryGuys);
router.get("/deliveryGuy/:id", adminMiddleware, getDeliveryGuyById);
router.post('/filterAdmins', handleAdminFilter);
router.post('/filterUsers', handleUserFilter);
// router.post('/filterEmployees', handleEmployeeFilter);
router.post('/updateEmployeeStatus', updateEmployeeStatus);
router.get('/updateUserStatus', adminMiddleware, updateUserStatus);
router.patch('/assignEmployee', adminMiddleware, assignEmployee);

export default router;
