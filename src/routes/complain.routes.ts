import { Router, Request, Response } from "express";
import { checkPermissions } from "../middleware/checkPermission";
import { createComplaint, createComplainType, deleteComplaint, deleteComplainType, getAllComplaintsByAdmin, getAllComplainTypes, getComplaintById, getComplainTypeById, updateComplaint, updateComplainType } from "../controllers/admin/complain.controllers";
import { isUserLoggedIn } from "../middleware/isUserLogedIn";


const router = Router();

// For admin only
router.post('/type', checkPermissions('Create Complain Type'),createComplainType);
router.get('/types',checkPermissions('View Complain Table'), getAllComplainTypes);
router.put('/type/:id',checkPermissions('Edit Complain Type'), updateComplainType);
router.get('/type/:id',checkPermissions('View Complain Table'), getComplainTypeById);
router.delete('/type/:id',checkPermissions('Delete Complain Type'),deleteComplainType );

router.post('/', checkPermissions('Create Complain'),createComplaint);
router.get('/',checkPermissions('View Complain'), getAllComplaintsByAdmin);
router.put('/:id',checkPermissions('Edit Complain'), updateComplaint);
router.delete('/:id',checkPermissions('Delete Complain'), deleteComplaint);

// Create Complain by user route (same function but different route)
router.post('/user', isUserLoggedIn,createComplaint);


// Pending
router.post('resolve/:id',checkPermissions('Resolve Complain'), getComplainTypeById);


//get complains through complain id id
router.get('/:id',checkPermissions('View Complain'), getComplaintById);

// Complain for a particular loggedin user 
router.get('/user/complains',isUserLoggedIn, getComplaintById);



export default router;
