import { Router } from 'express';
import { 
  loginRole, updateRole, getRoleById, getAllRole, 
  handleAdminFilter, handleUserFilter 
} from '../controllers/auth/oldrole.controller';
import { superAdminMiddleware } from '../middleware/superadmin.middleware';
import {  
  createEmployee
} from '../controllers/admin/employee.controller';
import { createRole } from '../controllers/auth/role.controller';

const router = Router();

router.post('/createRole', superAdminMiddleware, createRole);
router.post("/create/employee", superAdminMiddleware, createEmployee);

export default router;
