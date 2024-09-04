import { Router, Request, Response } from "express";
import { checkPermissions } from "../middleware/checkPermission";
import { createComplainType, deleteComplainType, getAllComplainTypes, getComplainTypeById, updateComplainType } from "../controllers/admin/complain.controllers";


const router = Router();


router.post('/type/create', checkPermissions('Create Complain Type'),createComplainType);
router.get('/type/getAll',checkPermissions('View Complain Type'), getAllComplainTypes);
router.put('/type/update/:id',checkPermissions('Edit Complain Type'), updateComplainType);
router.get('/type/:id',checkPermissions('Toggle Complain Type'), getComplainTypeById);
router.delete('/type/delete/:id',checkPermissions('Delete Complain Type'),deleteComplainType );

export default router;
