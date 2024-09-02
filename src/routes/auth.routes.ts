import { Router } from 'express';
import {  CreateFeedback,  DeleteFeedback, GetAllFeedback, GetFeedbackByUserId, sendOTP, UpdateFeedback } from '../controllers/user.controller';
import { isUserLoggedIn } from '../middleware/isUserLogedIn';
import { LoginUserByGoogle } from '../controllers/auth/userauth.controller';

const router = Router();

router.post('/otp', sendOTP);
router.post('/loginUser', LoginUserByGoogle);


router.post('/feedback/Create',isUserLoggedIn, CreateFeedback);
router.get('/getFeedback',isUserLoggedIn, GetFeedbackByUserId);
router.patch('/updateFeedback',isUserLoggedIn, UpdateFeedback);
router.delete('/deleteFeedback',isUserLoggedIn, DeleteFeedback);
router.get('/feedbackByUserId',isUserLoggedIn, GetFeedbackByUserId);
router.get('/allFeedback',isUserLoggedIn, GetAllFeedback);

export default router;
