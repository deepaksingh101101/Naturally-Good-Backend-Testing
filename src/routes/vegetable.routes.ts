import { Router } from "express";
import express from 'express';

import { createVegetable } from '../controllers/vegetable.controller';

// const router = Router();
const router = express.Router();

router.post('/create/:adminId', createVegetable);

export default router;
