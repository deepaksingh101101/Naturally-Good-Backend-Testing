import { Router, Request, Response } from "express";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/task.controller";
import { createCity, createLocality, createRoute, createVehicle, createZone, deleteVehicle, getAllCity, getAllLocalities, getAllRoutes, getAllVehicles, getAllZones, getCity, getLocalityById, getRouteById, getVehicleById, getZoneById, toggleRouteStatus, updateCity, updateLocality, updateLocalityServiceable, updateRoute, updateServiceableStatus, updateVehicle, updateVehicleStatus, updateZone, updateZoneServiceable } from "../controllers/route.controller";
import { checkPermissions } from "../middleware/checkPermission";


const router = Router();

router.get('/vehicle/all',checkPermissions('View Route'), getAllVehicles);
router.get('/vehicle/:id',checkPermissions('View Route'), getVehicleById);
router.post('/vehicle/create',checkPermissions('Create Route'), createVehicle);
router.put('/vehicle/:id',checkPermissions('Edit Route'), updateVehicle);
router.put('/vehicle/toggle/:id',checkPermissions('Toggle Route'), updateVehicleStatus);


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


router.get('/route/all',checkPermissions('View Route'), getAllRoutes);
router.get('/route/:id',checkPermissions('View Route'), getRouteById);
router.post('/route/create',checkPermissions('Create Route'), createRoute);
router.put('/route/:id',checkPermissions('Edit Route'), updateRoute);
router.put('/route/toggle/:id',checkPermissions('Toggle Route'), toggleRouteStatus);


router.get('/city/all',checkPermissions('View Route'), getAllCity);
router.get('/city/:id',checkPermissions('View Route'), getCity);
router.post('/city/create',checkPermissions('Create Route'), createCity);
router.put('/city/:id',checkPermissions('Edit Route'), updateCity);
router.put('/city/toggle/:id',checkPermissions('Toggle Route'), updateServiceableStatus);



export default router;
