import { Router } from 'express';
import {  adminLogin, createAdmin  , getAdminById, getAllAdmins,updateAdmin} from '../controllers/auth/adminauth.controller';
import { superAdminMiddleware } from '../middleware/superadmin.middleware';

const router = Router();

router.post('/create',superAdminMiddleware, createAdmin);
router.get("/getalladmin",superAdminMiddleware ,getAllAdmins)
router.get("/getadminbyid/:adminId",superAdminMiddleware,getAdminById)
router.put("/update/:adminId",updateAdmin)
router.post("/adminlogin",adminLogin)
export default router;
