import { Router, Request, Response } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/admin/category.controllers";
import { adminMiddleware } from '../middleware/adminIdMiddleware';


const router = Router();


router.post('/create', adminMiddleware,createCategory);
router.get('/getAll',adminMiddleware, getAllCategories);
router.delete('/delete/:id',adminMiddleware,deleteCategory );
router.patch('/update/:id',adminMiddleware, updateCategory);
router.get('/:id',adminMiddleware, getCategoryById);

export default router;
