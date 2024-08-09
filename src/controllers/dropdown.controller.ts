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
    // Convert the input name to lowercase
    const typeName = req.body.Name.toLowerCase();

    // Check if the type already exists, case insensitive
    const existingType = await TypesModel.findOne({ Name: typeName });
    if (existingType) {
      return res.status(400).json({ error: 'Type already exists' });
    }

    // Create a new type with the name in lowercase
    const newType = new TypesModel({ ...req.body, Name: typeName });
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
    // Convert the input name to lowercase
    const seasonName = req.body.Name.toLowerCase();

    // Check if the season already exists, case insensitive
    const existingSeason = await SeasonModel.findOne({ Name: seasonName });
    if (existingSeason) {
      return res.status(400).json({ error: 'Season already exists' });
    }

    // Create a new season with the name in lowercase
    const newSeason = new SeasonModel({ ...req.body, Name: seasonName });
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
    // Convert the input name to lowercase
    const rosterName = req.body.Name.toLowerCase();

    // Check if the roster already exists, case insensitive
    const existingRoster = await RosterModel.findOne({ Name: rosterName });
    if (existingRoster) {
      return res.status(400).json({ error: 'Roster already exists' });
    }

    // Create a new roster with the name in lowercase
    const newRoster = new RosterModel({ ...req.body, Name: rosterName });
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
