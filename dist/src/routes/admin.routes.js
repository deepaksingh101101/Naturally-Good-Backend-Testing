"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/admin/employee.controller");
const role_controller_1 = require("../controllers/auth/role.controller");
const checkPermission_1 = require("../middleware/checkPermission");
const isRoleLogedIn_1 = require("../middleware/isRoleLogedIn");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Pass the specific action name as a parameter to the middleware
router.post('/role', (0, checkPermission_1.checkPermissions)('Create Role'), role_controller_1.createRole);
router.get('/rolesandpermission', (0, checkPermission_1.checkPermissions)('View Role'), role_controller_1.getAllRoles);
router.get('/role', isRoleLogedIn_1.isRoleLoggedIn, role_controller_1.getAllRolesNameAndId); //No permission added
// Super Admin Creation
router.post('/superadmin', employee_controller_1.createSuperAdmin);
// Employee Creation
router.post('/employee', (0, checkPermission_1.checkPermissions)('Create Employee'), employee_controller_1.createEmployee);
router.get('/employee/filter', (0, checkPermission_1.checkPermissions)('View Employee'), employee_controller_1.searchEmployee);
router.put('/employee/:id', (0, checkPermission_1.checkPermissions)('Edit Employee'), employee_controller_1.editEmployeeById);
router.get('/employee', (0, checkPermission_1.checkPermissions)('View Employee'), employee_controller_1.getAllEmployees);
router.get('/employee/:id', (0, checkPermission_1.checkPermissions)('View Employee'), employee_controller_1.getEmployeeById);
router.post('/employee/login', employee_controller_1.loginEmployee);
router.get('/emplooyee/permission', isRoleLogedIn_1.isRoleLoggedIn, employee_controller_1.getPermissionByEmployeeId);
// User/Customer Creation By Admin
router.post('/user', (0, checkPermission_1.checkPermissions)('Create Customer'), user_controller_1.createUserByAdmin);
router.put('/user/toggle/:id', (0, checkPermission_1.checkPermissions)('Customer Status'), user_controller_1.updateAccountStatusByAdmin);
router.get('/user/filter', (0, checkPermission_1.checkPermissions)('View Employee'), employee_controller_1.searchUser);
router.get('/user', (0, checkPermission_1.checkPermissions)('View Customer'), user_controller_1.getAllUserByAdmin);
router.get('/user/:id', (0, checkPermission_1.checkPermissions)('View Customer'), user_controller_1.getUserByIdForAdmin);
router.put('/user/:id', (0, checkPermission_1.checkPermissions)('Edit Customer'), user_controller_1.updateUserByAdmin);
exports.default = router;
