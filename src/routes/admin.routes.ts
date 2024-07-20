import { Router } from 'express';
import {  loginRole, createRole ,updateRole , getRoleById, getAllRole} from '../controllers/auth/role.controller';
import { superAdminMiddleware } from '../middleware/superadmin.middleware';
import { adminMiddleware } from '../middleware/adminIdMiddleware';
import { createDeliveryGuy, deliveryGuyLogin, getAllDeliveryGuys, updateDeliveryGuy ,getDeliveryGuyById} from '../controllers/admin/employee.controller';

const router = Router();

router.post('/create',superAdminMiddleware, createRole);
router.get("/getallrole",superAdminMiddleware ,getAllRole);
router.get("/getrolebyid/:adminId",superAdminMiddleware,getRoleById);
router.put("/update/:id",updateRole);
router.post("/rolelogin",loginRole);
router.post("/create/delivery" , adminMiddleware , createDeliveryGuy);
router.post("/login/delivery"  , deliveryGuyLogin);
router.put('/update/delivery/:id', updateDeliveryGuy);
router.get('/getall/delivery',adminMiddleware,getAllDeliveryGuys)
router.get("/deliveryGuy/:id",adminMiddleware,getDeliveryGuyById)

export default router;