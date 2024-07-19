import { superAdminMiddleware } from './../middleware/superadmin.middleware';
import { Router, Request, Response } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/admin/category.controllers";


const router = Router();


router.post('/create', superAdminMiddleware,createCategory);
router.get('/getAll', getAllCategories);
router.delete('/delete/:id',deleteCategory );
router.patch('/update/:id', updateCategory);
router.get('/:id', getCategoryById);

export default router;
