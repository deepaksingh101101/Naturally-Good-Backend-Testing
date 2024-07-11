import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

class SubscriptionPlan {
  @prop({ type: String, required: true })
  public houseNumber: string;

  @prop({ type: String, required: true })
  public city: string;
}

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Subscription {
  @prop({ type: String, required: true })
  public subscriptionID: string;

  @prop({ type: String, required: true })
  public userId: string;

  @prop({ type: () => SubscriptionPlan, required: true })
  public subscriptionPlan: SubscriptionPlan;

  @prop({ type: Date })
  public subscriptionStartDate?: Date;

  @prop({ type: Date })
  public subscriptionEndDate?: Date;

  @prop({ type: String })
  public paymentStatus?: String;

  @prop({ type: Boolean, })
  public subscriptionStatus: boolean;

  @prop({ type: String, required: true })
  public completedAt: string;

  @prop({ type: String, required: true })
  public updatedAt: string;

  @prop({ type: String, required: true })
  public createdAt: string;
}

const SubscriptionModel = getModelForClass(Subscription);

export default SubscriptionModel;
