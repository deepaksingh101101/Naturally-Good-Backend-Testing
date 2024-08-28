import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { Subscription } from './subscription.model';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Coupon {
  @prop({ type: String, enum: ['Global', 'SubscriptionBasis'], required: true })
  public CouponType: 'Global' | 'SubscriptionBasis';

  @prop({ type: String, required: true })
  public CouponCode: string;

  @prop({ type: Number, required: true })
  public DiscountPrice: number;

  @prop({ type: Date, required: true })
  public CouponStartDate: Date;

  @prop({ type: Date, required: true })
  public CouponEndDate: Date;

  @prop({ type: String, enum: ['Admin', 'Public'], required: true })
  public CouponVisibility: 'Admin' | 'Public';

  @prop({ type: String, enum: ['Active', 'Inactive'], required: true })
  public Status: 'Active' | 'Inactive';

  @prop({ type: String })
  public Description?: string;

  @prop({ type: String })
  public ImageUrl?: string;
}

const CouponModel = getModelForClass(Coupon);

export default CouponModel;
