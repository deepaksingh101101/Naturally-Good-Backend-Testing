import { Request, Response } from 'express';
import ProductModel from '../../models/product.model';
import { CategoryType } from '../../models/category.model';
import PlanModel from '../../models/plan.model';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const AdminId = req['adminId'];
        const { SubscriptionPlan } = req.body;


        const existingPlan = await PlanModel.findOne({ SubscriptionPlan });
        if (existingPlan) {
            return res.status(400).json({ error: 'Subscription plan already exists' });
        }


        const plan = new PlanModel({
            ...req.body,
            createdBy: AdminId 
        });

        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
