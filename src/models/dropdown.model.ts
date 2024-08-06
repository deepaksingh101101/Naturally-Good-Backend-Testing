import { prop, getModelForClass } from '@typegoose/typegoose';

// Define the Types schema
class Types {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}

// Define the Season schema
class Season {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}

// Define the Roster schema
class Roster {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}

// Create models for each schema
const TypesModel = getModelForClass(Types);
const SeasonModel = getModelForClass(Season);
const RosterModel = getModelForClass(Roster);

export { TypesModel, SeasonModel, RosterModel };
