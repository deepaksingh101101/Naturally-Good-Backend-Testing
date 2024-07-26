import { Request, Response } from 'express';
import ProductModel from '../../models/product.model';
import { CategoryType } from '../../models/category.model';
import PlanModel from '../../models/plan.model';

export const createPlan = async (req: Request, res: Response) => {
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

export const deletePlan = async (req: Request, res: Response) => {
    try {
        const { planId } = req.query;

        const plan = await PlanModel.findByIdAndDelete(planId);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const updatePlan = async (req: Request, res: Response) => {
    try {
        const { planId } = req.query;
        const updateData = req.body;

        const plan = await PlanModel.findByIdAndUpdate(planId, updateData, { new: true, runValidators: true });
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        res.status(200).json({ message: 'Plan updated successfully', plan });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const getAllPlans = async (req: Request, res: Response) => {
    try {
        const plans = await PlanModel.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};


export const getPlanById = async (req: Request, res: Response) => {
    try {
        const { planId } = req.query;

        const plan = await PlanModel.findById(planId);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

