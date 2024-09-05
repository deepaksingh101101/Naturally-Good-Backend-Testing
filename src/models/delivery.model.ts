import { getModelForClass, ModelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { Bag } from './bag.model';
import { Product } from './product.model';
import { Route, Vehicle } from './route.model';
import { Employee } from './employee.model';
import { Complaints } from './complaints.model';
import { User } from './user.model';

export enum DeliveryStatus {
  Pending = 'pending',
  Delivered = 'delivered',
  Skipped = 'skipped',
}

class BagDetails {
  @prop({ ref: () => Bag, required: true })
  public BagID!: Ref<Bag>;

  @prop({ type: Number, required: true })
  public BagWeight!: number;
}

class AddonDetails {
  @prop({ ref: () => Product, required: true })
  public ProductId!: Ref<Product>;

  @prop({ type: Number, required: true })
  public RequiredUnits!: number;

  @prop({ type: Number, required: true })
  public TotalPrice!: number;
}

@pre<Delivery>('save', async function() {
  this.UpdatedAt = new Date();
})

export class Delivery {

  // @prop({ ref: () => User, required: true })
  // public UserId!: Ref<User>;

  @prop({ type: Date, required: true })
  public DeliveryDate!: Date;

  @prop({ type: String, required: true })
  public DeliveryTime!: string;

  @prop({ type: String, enum: DeliveryStatus, required: true, default: DeliveryStatus.Pending })
  public Status!: DeliveryStatus;

  @prop({ ref: () => Route, required: true })
  public AssignedRoute!: Ref<Route>;

  @prop({ ref: () => Vehicle, required: true })
  public AssignedVehicle!: Ref<Vehicle>;

  @prop({ type: () => [BagDetails], required: true })
  public Bag!: BagDetails[];

  @prop({ type: () => [AddonDetails], required: true })
  public Addons!: AddonDetails[];

  @prop({ type: String })
  public Note?: string;

  // @prop({ ref: () => Complaints})
  // public AnyComplained: Ref<Complaints>;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Employee })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee })
  public UpdatedBy!: Ref<Employee>;

}

const DeliveryModel = getModelForClass(Delivery);

export default DeliveryModel;
