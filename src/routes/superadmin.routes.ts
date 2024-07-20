import { Router } from 'express';
import { createSuperAdmin, handleFilter, loginSuperAdmin } from '../controllers/auth/superadmin.controller';

const router = Router();

router.post('/superadmin', createSuperAdmin);
router.post('/loginsuperadmin',loginSuperAdmin)
router.post('/filterUsers/',handleFilter)


export default router;
