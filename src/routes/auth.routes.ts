import { Router } from 'express';
import { CreateBag, CreateFeedback, DeleteBagByUser, DeleteFeedback, GetAllFeedback, GetBagByUser, GetFeedbackByUserId, sendOTP, UpdateBagByUser, UpdateFeedback } from '../controllers/user.controller';
import { isUserLoggedIn } from '../middleware/isUserLogedIn';
import { LoginUserByGoogle } from '../controllers/auth/userauth.controller';

const router = Router();

router.post('/otp', sendOTP);
router.post('/loginUser', LoginUserByGoogle);
router.post('/bag/Create',isUserLoggedIn, CreateBag);
router.get('/getBag',isUserLoggedIn, GetBagByUser);
router.patch('/updateBag',isUserLoggedIn, UpdateBagByUser);
router.delete('/deleteBag',isUserLoggedIn, DeleteBagByUser);

router.post('/feedback/Create',isUserLoggedIn, CreateFeedback);
router.get('/getFeedback',isUserLoggedIn, GetBagByUser);
router.patch('/updateFeedback',isUserLoggedIn, UpdateFeedback);
router.delete('/deleteFeedback',isUserLoggedIn, DeleteFeedback);
router.get('/feedbackByUserId',isUserLoggedIn, GetFeedbackByUserId);
router.get('/allFeedback',isUserLoggedIn, GetAllFeedback);

export default router;
