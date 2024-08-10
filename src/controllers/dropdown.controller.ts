import { Request, Response } from 'express';
import { RosterModel, SeasonModel, TypesModel, SubscriptionTypeModel, FrequencyTypeModel } from '../models/dropdown.model';

// Common function to handle errors
const handleError = (res: Response, error: any) => {
  res.status(500).json({ error: 'Internal server error' });
};

// Common function to check if name already exists
const checkExistingName = async (model: any, name: string) => {
  return await model.findOne({ Name: name.toLowerCase() });
};

// Types APIs
export const getTypes = async (req: Request, res: Response) => {
  try {
    const types = await TypesModel.find();
    return res.json(types);
  } catch (error) {
    handleError(res, error);
  }
};

export const createType = async (req: Request, res: Response) => {
  try {
    const { Name, SortOrder } = req.body;
    if (!Name || SortOrder === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const name = Name.toLowerCase();
    if (await checkExistingName(TypesModel, name)) {
      return res.status(400).json({ error: 'Type already exists' });
    }
    const newType = new TypesModel({ Name: name, SortOrder });
    await newType.save();
    res.status(201).json(newType);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteType = async (req: Request, res: Response) => {
  try {
    const type = await TypesModel.findByIdAndDelete(req.params.id);
    if (!type) {
      return res.status(404).json({ error: 'Type not found' });
    }
    return res.status(204).json({ message: 'Type deleted' });
  } catch (error) {
    handleError(res, error);
  }
};

// Seasons APIs
export const getSeasons = async (req: Request, res: Response) => {
  try {
    const seasons = await SeasonModel.find();
    return res.json(seasons);
  } catch (error) {
    handleError(res, error);
  }
};

export const createSeason = async (req: Request, res: Response) => {
  try {
    const { Name, SortOrder } = req.body;
    if (!Name  === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const name = Name.toLowerCase();
    if (await checkExistingName(SeasonModel, name)) {
      return res.status(400).json({ error: 'Season already exists' });
    }
    const newSeason = new SeasonModel({ Name: name, SortOrder });
    await newSeason.save();
    res.status(201).json(newSeason);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteSeason = async (req: Request, res: Response) => {
  try {
    const season = await SeasonModel.findByIdAndDelete(req.params.id);
    if (!season) {
      return res.status(404).json({ error: 'Season not found' });
    }
    return res.status(204).json({ message: 'Season deleted' });
  } catch (error) {
    handleError(res, error);
  }
};

// Rosters APIs
export const getRosters = async (req: Request, res: Response) => {
  try {
    const rosters = await RosterModel.find();
    return res.json(rosters);
  } catch (error) {
    handleError(res, error);
  }
};

export const createRoster = async (req: Request, res: Response) => {
  try {
    const { Name, SortOrder } = req.body;
    if (!Name || SortOrder === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const name = Name.toLowerCase();
    if (await checkExistingName(RosterModel, name)) {
      return res.status(400).json({ error: 'Roster already exists' });
    }
    const newRoster = new RosterModel({ Name: name, SortOrder });
    await newRoster.save();
    res.status(201).json(newRoster);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteRoster = async (req: Request, res: Response) => {
  try {
    const roster = await RosterModel.findByIdAndDelete(req.params.id);
    if (!roster) {
      return res.status(404).json({ error: 'Roster not found' });
    }
    return res.status(204).json({ message: 'Roster deleted' });
  } catch (error) {
    handleError(res, error);
  }
};

// Subscription Types APIs
export const getSubscriptionTypes = async (req: Request, res: Response) => {
  try {
    const subscriptionTypes = await SubscriptionTypeModel.find();
    return res.json(subscriptionTypes);
  } catch (error) {
    handleError(res, error);
  }
};

export const createSubscriptionType = async (req: Request, res: Response) => {
  try {
    const { Name, Value } = req.body;
    if (!Name || Value === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const name = Name.toLowerCase();
    if (await checkExistingName(SubscriptionTypeModel, name)) {
      return res.status(400).json({ error: 'Subscription Type already exists' });
    }
    const newSubscriptionType = new SubscriptionTypeModel({ Name: name, Value });
    await newSubscriptionType.save();
    res.status(201).json(newSubscriptionType);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteSubscriptionType = async (req: Request, res: Response) => {
  try {
    const subscriptionType = await SubscriptionTypeModel.findByIdAndDelete(req.params.id);
    if (!subscriptionType) {
      return res.status(404).json({ error: 'Subscription Type not found' });
    }
    return res.status(204).json({ message: 'Subscription Type deleted' });
  } catch (error) {
    handleError(res, error);
  }
};

// Frequency Types APIs
export const getFrequencyTypes = async (req: Request, res: Response) => {
  try {
    const frequencyTypes = await FrequencyTypeModel.find();
    return res.status(200).json(frequencyTypes);
  } catch (error) {
    handleError(res, error);
  }
};

export const createFrequencyType = async (req: Request, res: Response) => {
  try {
    const { Name,  Value } = req.body;
    if (!Name || Value === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const name = Name.toLowerCase();
    if (await checkExistingName(FrequencyTypeModel, name)) {
      return res.status(400).json({ error: 'Frequency Type already exists' });
    }
    const newFrequencyType = new FrequencyTypeModel({ Name: name, Value });
    await newFrequencyType.save();
    res.status(201).json(newFrequencyType);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteFrequencyType = async (req: Request, res: Response) => {
  try {
    const frequencyType = await FrequencyTypeModel.findByIdAndDelete(req.params.id);
    if (!frequencyType) {
      return res.status(404).json({ error: 'Frequency Type not found' });
    }
    return res.status(204).json({ message: 'Frequency Type deleted' });
  } catch (error) {
    handleError(res, error);
  }
};
