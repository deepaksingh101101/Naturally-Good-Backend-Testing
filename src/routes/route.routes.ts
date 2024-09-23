import { Router, Request, Response } from "express";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/task.controller";
import { createCity, createLocality, createRoute, createVehicle, createZone, deleteVehicle, filterCities, getAllCity, getAllLocalities, getAllRoutes, getAllVehicles, getAllZones, getCity, getLocalityById, getRouteById, getVehicleById, getZoneById, searchZones, toggleRouteStatus, updateCity, updateLocality, updateLocalityServiceable, updateRoute, updateServiceableStatus, updateVehicle, updateVehicleStatus, updateZone, updateZoneServiceable } from "../controllers/route.controller";
import { checkPermissions } from "../middleware/checkPermission";


const router = Router();

router.get('/vehicles',checkPermissions('View Route'), getAllVehicles);
router.get('/vehicle/:id',checkPermissions('View Route'), getVehicleById);
router.post('/vehicle/',checkPermissions('Create Route'), createVehicle);
router.put('/vehicle/:id',checkPermissions('Edit Route'), updateVehicle);
router.put('/vehicle/toggle/:id',checkPermissions('Toggle Route'), updateVehicleStatus);


router.get('/localitys',checkPermissions('View Route'), getAllLocalities);
router.get('/locality/:id',checkPermissions('View Route'), getLocalityById);
router.post('/locality',checkPermissions('Create Route'), createLocality);
router.put('/locality/:id',checkPermissions('Edit Route'), updateLocality);
router.put('/locality/toggle/:id',checkPermissions('Toggle Route'), updateLocalityServiceable);


router.get('/zones',checkPermissions('View Route'), getAllZones);
router.get('/zone/filter',checkPermissions('View Route'), searchZones);
router.get('/zone/:id',checkPermissions('View Route'), getZoneById);
router.post('/zone',checkPermissions('Create Route'), createZone);
router.put('/zone/:id',checkPermissions('Edit Route'), updateZone);
router.put('/zone/toggle/:id',checkPermissions('Toggle Route'), updateZoneServiceable);


router.get('/routes',checkPermissions('View Route'), getAllRoutes);
router.get('/route/:id',checkPermissions('View Route'), getRouteById);
router.post('/route',checkPermissions('Create Route'), createRoute);
router.put('/route/:id',checkPermissions('Edit Route'), updateRoute);
router.put('/toggle/:id',checkPermissions('Toggle Route'), toggleRouteStatus);


router.get('/citys',checkPermissions('View Route'), getAllCity);
router.get('/city/filter',checkPermissions('View Route'), filterCities);
router.get('/city/:id',checkPermissions('View Route'), getCity);
router.post('/city',checkPermissions('Create Route'), createCity);
router.put('/city/:id',checkPermissions('Edit Route'), updateCity);
router.put('/city/toggle/:id',checkPermissions('Toggle Route'), updateServiceableStatus);



export default router;
