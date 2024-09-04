import { Router, Request, Response } from "express";
import { checkPermissions } from "../middleware/checkPermission";
import { createComplainType, deleteComplainType, getAllComplainTypes, getComplainTypeById, updateComplainType } from "../controllers/admin/complain.controllers";


const router = Router();


router.post('/type', checkPermissions('Create Complain Type'),createComplainType);
router.get('/types',checkPermissions('View Complain Type'), getAllComplainTypes);
router.put('/type/:id',checkPermissions('Edit Complain Type'), updateComplainType);
router.get('/type/:id',checkPermissions('Toggle Complain Type'), getComplainTypeById);
router.delete('/type/:id',checkPermissions('Delete Complain Type'),deleteComplainType );

router.post('/', checkPermissions('Create Complain Type'),createComplainType);
router.get('/',checkPermissions('View Complain Type'), getAllComplainTypes);
router.put('/:id',checkPermissions('Edit Complain Type'), updateComplainType);
router.get('/:id',checkPermissions('Toggle Complain Type'), getComplainTypeById);



export default router;
