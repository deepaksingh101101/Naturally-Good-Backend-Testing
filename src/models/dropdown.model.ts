import { prop, getModelForClass, Ref, pre } from '@typegoose/typegoose';
import { Employee } from './employee.model';

@pre<ProductType>('save', async function() {
  this.UpdatedAt = new Date();
})
@pre<Roster>('save', async function() {
  this.UpdatedAt = new Date();
})
@pre<Season>('save', async function() {
  this.UpdatedAt = new Date();
})
@pre<SubscriptionType>('save', async function() {
  this.UpdatedAt = new Date();
})
@pre<FrequencyType>('save', async function() {
  this.UpdatedAt = new Date();
})
@pre<SourceOfCustomer>('save', async function() {
  this.UpdatedAt = new Date();
})
@pre<TypeOfCustomer>('save', async function() {
  this.UpdatedAt = new Date();
})

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
// Define the Roster schema
export class Roster {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ required: true })
  public SortOrder!: number;

  @prop({ ref: () => Employee, required: false })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: false })
  public UpdatedBy!: Ref<Employee>;

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

  @prop({ ref: () => Employee, required: false })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: false })
  public UpdatedBy!: Ref<Employee>;

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

@prop({ type:Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ ref: () => Employee, required: false })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: false })
  public UpdatedBy!: Ref<Employee>;
}


// Define the Frequency Type schema
export class FrequencyType {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ required: true })
  public Value!: number;

  @prop({ Type:Number,required: true,default:0 })
  public DayBasis!: number;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ ref: () => Employee, required: false })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: false })
  public UpdatedBy!: Ref<Employee>;
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


export class SourceOfCustomer {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Employee, required: false })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: false })
  public UpdatedBy!: Ref<Employee>;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}


export class TypeOfCustomer {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Employee, required: false })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: false })
  public UpdatedBy!: Ref<Employee>;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}



export class ProductPriority {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Employee, required: false })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: false })
  public UpdatedBy!: Ref<Employee>;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}


// Group of product 
export class ProductGroup {
  @prop({ type: String, required: true })
  public Name!: string;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Employee, required: false })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: false })
  public UpdatedBy!: Ref<Employee>;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;
}


// Modal for delivery time slot
export class DeliveryTimeSlot {
  @prop({ type: String, required: true })
  public Start!: string;

  @prop({ type: String, required: true })
  public End!: string;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Employee, required: false })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee, required: false })
  public UpdatedBy!: Ref<Employee>;

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
const SourceOfCustomerModel = getModelForClass(SourceOfCustomer);
const TypeOfCustomerModel = getModelForClass(TypeOfCustomer);
const ProductPriorityModel = getModelForClass(ProductPriority);
const ProductGroupModel = getModelForClass(ProductGroup);
const DeliveryTimeSlotModel = getModelForClass(DeliveryTimeSlot);

export {DeliveryTimeSlotModel,ProductGroupModel,ProductPriorityModel,SourceOfCustomerModel,TypeOfCustomerModel, ProductTypeModel, SeasonModel, RosterModel, SubscriptionTypeModel, FrequencyTypeModel,RoleTypeModel };
