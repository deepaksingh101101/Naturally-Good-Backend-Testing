import { Request, Response } from 'express';
import TaskModel from '../models/task.model';

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await TaskModel.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const task = await TaskModel.findById(req.params.id);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const task = new TaskModel(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
      const task = await TaskModel.findByIdAndDelete(req.params.id);
      if (task) {
          res.status(200).json({ message: 'Task successfully deleted' });
      } else {
          res.status(404).json({ error: 'Task not found' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};
