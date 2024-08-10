import { prop, getModelForClass } from '@typegoose/typegoose';

// Define the Types schema For Product
export class Types {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ required: true })
  public SortOrder!: number;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}

// Define the Season schema
export class Season {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ required: false })
  public SortOrder!: number;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}

// Define the Roster schema
export class Roster {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ required: true })
  public SortOrder!: number;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}

// Define the Subscription Type schema
export class SubscriptionType {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ required: true })
  public Value!: number;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}

// Define the Frequency Type schema
export class FrequencyType {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ required: true })
  public Value!: number;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}

// Create models for each schema
const TypesModel = getModelForClass(Types);
const SeasonModel = getModelForClass(Season);
const RosterModel = getModelForClass(Roster);
const SubscriptionTypeModel = getModelForClass(SubscriptionType);
const FrequencyTypeModel = getModelForClass(FrequencyType);

export { TypesModel, SeasonModel, RosterModel, SubscriptionTypeModel, FrequencyTypeModel };
