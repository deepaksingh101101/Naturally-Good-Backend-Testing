import { Router, Request, Response } from "express";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/task.controller";
import { createLocality, createVehicle, createZone, deleteVehicle, getAllLocalities, getAllVehicles, getAllZones, getLocalityById, getVehicleById, getZoneById, updateLocality, updateLocalityServiceable, updateVehicle, updateVehicleStatus, updateZone, updateZoneServiceable } from "../controllers/route.controller";
import { checkPermissions } from "../middleware/checkPermission";


const router = Router();

router.get('/city/all',checkPermissions('View Route'), getAllVehicles);
router.get('/city/:id',checkPermissions('View Route'), getVehicleById);
router.post('/city/create',checkPermissions('Create Route'), createVehicle);
router.put('/city/:id',checkPermissions('Edit Route'), updateVehicle);
router.put('/city/toggle/:id',checkPermissions('Toggle Route'), updateVehicleStatus);


router.get('/locality/all',checkPermissions('View Route'), getAllLocalities);
router.get('/locality/:id',checkPermissions('View Route'), getLocalityById);
router.post('/locality/create',checkPermissions('Create Route'), createLocality);
router.put('/locality/:id',checkPermissions('Edit Route'), updateLocality);
router.put('/locality/toggle/:id',checkPermissions('Toggle Route'), updateLocalityServiceable);


router.get('/zone/all',checkPermissions('View Route'), getAllZones);
router.get('/zone/:id',checkPermissions('View Route'), getZoneById);
router.post('/zone/create',checkPermissions('Create Route'), createZone);
router.put('/zone/:id',checkPermissions('Edit Route'), updateZone);
router.put('/zone/toggle/:id',checkPermissions('Toggle Route'), updateZoneServiceable);

export default router;
