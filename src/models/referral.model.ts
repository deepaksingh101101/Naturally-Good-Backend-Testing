import { getModelForClass, pre, prop, Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Subscription } from './subscription.model';
import { Order } from './order.model';
import { Coupon } from './coupons.model';

@pre<Referral>('save', async function () {
  this.UpdatedAt = new Date();
})
class Referral {

  @prop({ ref: () => User, required: true })
  public ReferredBy!: Ref<User>;

  @prop({ ref: () => User })
  public ReferredTO!: Ref<User>;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Subscription })
  public SubscriptionPurchased!: Ref<Subscription>;

  @prop({ type: Boolean, default: false })
  public isReferredPersonLoggedIn!: boolean;

}

const ReferralModel = getModelForClass(Referral);

export default ReferralModel;
