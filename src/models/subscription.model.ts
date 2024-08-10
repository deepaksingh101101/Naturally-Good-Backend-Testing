import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Subscription {


  @prop({ type: Date })
  public SubscriptionStartDate?: Date;

  @prop({ type: Date })
  public SubscriptionEndDate?: Date;

  @prop({ type: String })
  public PaymentStatus?: String;

  @prop({ type: Boolean, })
  public SubscriptionStatus: boolean;

  @prop({ type: String, required: true })
  public CompletedAt: string;

  @prop({ type: String, required: true })
  public UpdatedAt: string;

  @prop({ type: String, required: true })
  public CreatedAt: string;
}

const SubscriptionModel = getModelForClass(Subscription);

export default SubscriptionModel;
