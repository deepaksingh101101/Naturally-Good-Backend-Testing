import { Router } from 'express';
import { sendOTP } from '../controllers/user.controller';

const router = Router();

router.post('/otp', sendOTP);

export default router;
