import { Request, Response } from 'express';
import { RosterModel, SeasonModel, TypesModel } from '../models/dropdown.model';

// Get all Types
export const getTypes = async (req: Request, res: Response) => {
  try {
    const types = await TypesModel.find();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new Type
export const createType = async (req: Request, res: Response) => {
  try {
    const existingType = await TypesModel.findOne({ Name: req.body.Name });
    if (existingType) {
      return res.status(400).json({ error: 'Type already exists' });
    }
    const newType = new TypesModel(req.body);
    await newType.save();
    res.status(201).json(newType);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a Type by ID
export const deleteType = async (req: Request, res: Response) => {
  try {
    await TypesModel.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Type deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all Seasons
export const getSeasons = async (req: Request, res: Response) => {
  try {
    const seasons = await SeasonModel.find();
    res.json(seasons);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new Season
export const createSeason = async (req: Request, res: Response) => {
  try {
    const existingSeason = await SeasonModel.findOne({ Name: req.body.Name });
    if (existingSeason) {
      return res.status(400).json({ error: 'Season already exists' });
    }
    const newSeason = new SeasonModel(req.body);
    await newSeason.save();
    res.status(201).json(newSeason);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a Season by ID
export const deleteSeason = async (req: Request, res: Response) => {
  try {
    await SeasonModel.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Season deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all Rosters
export const getRosters = async (req: Request, res: Response) => {
  try {
    const rosters = await RosterModel.find();
    res.json(rosters);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new Roster
export const createRoster = async (req: Request, res: Response) => {
  try {
    const existingRoster = await RosterModel.findOne({ Name: req.body.Name });
    if (existingRoster) {
      return res.status(400).json({ error: 'Roster already exists' });
    }
    const newRoster = new RosterModel(req.body);
    await newRoster.save();
    res.status(201).json(newRoster);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a Roster by ID
export const deleteRoster = async (req: Request, res: Response) => {
  try {
    await RosterModel.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Roster deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
