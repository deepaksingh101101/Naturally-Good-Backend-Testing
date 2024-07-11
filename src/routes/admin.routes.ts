import { Router } from 'express';
import {  createAdmin  , getAdminById, getAllAdmins} from '../controllers/auth/adminauth.controller';
import { superAdminMiddleware } from '../middleware/middleware';

const router = Router();

router.post('/create',superAdminMiddleware, createAdmin);
router.get("/getalladmin",superAdminMiddleware ,getAllAdmins)
router.get("/getadminbyid/:adminId",superAdminMiddleware,getAdminById)
export default router;
