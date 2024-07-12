import { Router } from 'express';
import {  adminLogin, createAdmin  , getAdminById, getAllAdmins,updateAdmin} from '../controllers/auth/adminauth.controller';
import { superAdminMiddleware } from '../middleware/superadmin.middleware';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createDeliveryGuy, deliveryGuyLogin } from '../controllers/admin/delivery.controller';

const router = Router();

router.post('/create',superAdminMiddleware, createAdmin);
router.get("/getalladmin",superAdminMiddleware ,getAllAdmins)
router.get("/getadminbyid/:adminId",superAdminMiddleware,getAdminById);
router.put("/update/:id",updateAdmin)
router.post("/adminlogin",adminLogin)
router.post("/create/delivery" , adminMiddleware , createDeliveryGuy)
router.post("/login/delivery" , adminMiddleware , deliveryGuyLogin)

export default router;
