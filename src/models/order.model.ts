import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

class items {

  @prop({ required: true })
  public VegetableName!: String;

  @prop({ required: true })
  public Quantity!: Number;

  @prop({ required: true })
  public Price!: string;
}
export enum OderStatus {
  InProgress = 'inprogress',
  Approved = 'approved',
  Reject = 'reject'
}
@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Order {

  @prop({ type: String, required: true })
  public UserId: string;

  @prop({ type: Date })
  public OrderDate: Date;

  @prop({ required: true })
  public VegetablesItems!: items;

  @prop({ type: String, enum: OderStatus, required: false })
  public DeliveryStatus?: OderStatus;

  @prop({ type: String })
  public PaymentId?: String;

  @prop({ type: Number, required: true })
  public TotalAmount: number;

  @prop({ type: String, required: true })
  public UpdatedAt: string;

  @prop({ type: String, required: true })
  public CreatedAt: string;
}

const OrderModel = getModelForClass(Order);

export default OrderModel;
