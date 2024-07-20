import { Router } from 'express';
import { createSuperAdmin, loginSuperAdmin } from '../controllers/auth/superadmin.controller';

const router = Router();

router.post('/superadmin', createSuperAdmin);
router.post('/loginsuperadmin',loginSuperAdmin)


export default router;
