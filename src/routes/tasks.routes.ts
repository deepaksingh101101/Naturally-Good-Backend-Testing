import { Router, Request, Response } from "express";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/task.controller";


const router = Router();

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/create', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
export default router;
