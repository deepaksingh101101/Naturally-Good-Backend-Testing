import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Employee } from './employee.model';

// Define the ProductType schema
export class ProductType {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ required: true })
  public SortOrder!: number;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ ref: () => Employee, required: false })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: false })
  public UpdatedBy!: Ref<Employee>;
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


// Define the Frequency Type schema
export class Role {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}

// Create models for each schema
const ProductTypeModel = getModelForClass(ProductType);
const SeasonModel = getModelForClass(Season);
const RosterModel = getModelForClass(Roster);
const SubscriptionTypeModel = getModelForClass(SubscriptionType);
const FrequencyTypeModel = getModelForClass(FrequencyType);
const RoleTypeModel = getModelForClass(Role);

export { ProductTypeModel, SeasonModel, RosterModel, SubscriptionTypeModel, FrequencyTypeModel,RoleTypeModel };
