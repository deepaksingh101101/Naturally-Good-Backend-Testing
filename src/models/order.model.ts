import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

class items {
  @prop({ required: true })
  public vegetableId!: String;

  @prop({ required: true })
  public vegetableName!: String;

  @prop({ required: true })
  public quantity!: Number;

  @prop({ required: true })
  public price!: string;
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
  public orderId: string;

  @prop({ type: String, required: true })
  public userId: string;

  @prop({ type: Date })
  public orderDate: Date;

  @prop({ required: true })
  public vegetablesItems!: items;

  @prop({ type: String, enum: OderStatus, required: false })
  public deliveryStatus?: OderStatus;

  @prop({ type: String })
  public paymentId?: String;

  @prop({ type: Number, required: true })
  public totalAmount: number;

  @prop({ type: String, required: true })
  public updatedAt: string;

  @prop({ type: String, required: true })
  public createdAt: string;
}

const OrderModel = getModelForClass(Order);

export default OrderModel;
