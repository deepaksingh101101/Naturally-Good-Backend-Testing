import { Router } from 'express';
import { createSuperAdmin, loginSuperAdmin } from '../controllers/auth/superadmin.controller';

const router = Router();

router.post('/create', createSuperAdmin);
router.post('/login',loginSuperAdmin)


export default router;
