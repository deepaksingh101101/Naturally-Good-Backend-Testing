import { getModelForClass, ModelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { Employee } from './employee.model';
import { User } from './user.model';
import { Subscription } from './subscription.model';
import { Coupon } from './coupons.model';
import { Delivery } from './delivery.model';

export enum PaymentType {
  Cash = 'cash',
  Card = 'card',
  Online = 'online',
}

export enum PaymentStatus {
  Paid = 'paid',
  Pending = 'pending',
}

@pre<Order>('save', async function() {
  this.UpdatedAt = new Date();
})

export class Order {
  @prop({ ref: () => User, required: true })
  public UserId!: Ref<User>;

  // @prop({ ref: () => Subscription, required: true })
  // public SubscriptionId!: Ref<Subscription>;

  @prop({ type: Number, required: true })
  public NetPrice!: number;

  @prop({ type: Date, required: true })
  public BookingDate!: Date;

  @prop({ type: Date, required: true })
  public DeliveryStartDate!: Date;

  @prop({ type: Date })
  public PaymentDate?: Date;

  @prop({ type: String, enum: PaymentType, required: true })
  public PaymentType!: PaymentType;

  @prop({ type: String, enum: PaymentStatus, required: true })
  public PaymentStatus!: PaymentStatus;

  @prop({ type: String })
  public SpecialInstruction?: string;

  @prop({ ref: () => Coupon })
  public Coupons?: Ref<Coupon>;

  @prop({ type: Number })
  public ManualDiscountPercentage?: number;

  @prop({ type: Number, required: true,default:0 })
  public AmountReceived!: number;

  @prop({ type: Number, required: true ,default:0})
  public AmountDue!: number;

  @prop({ ref: () => Delivery })
  public Deliveries!: Ref<Delivery>[];

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Employee })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee })
  public UpdatedBy!: Ref<Employee>;
}

const OrderModel = getModelForClass(Order);

export default OrderModel;
