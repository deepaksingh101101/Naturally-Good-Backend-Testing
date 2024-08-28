import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { FrequencyType, SubscriptionType } from './dropdown.model';
import { Bag } from './bag.model';
import { Coupon } from './coupons.model';

class DeliveryDay {
  @prop({ type: String, required: true })
  public day!: string;
}

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Subscription {

  @prop({ ref: () => SubscriptionType })
  public SubscriptionTypeId!: Ref<SubscriptionType>;

  @prop({ ref: () => FrequencyType })
  public FrequencyId!: Ref<FrequencyType>;

  @prop({ type: Number, required: true })
  public TotalDeliveryNumber!: number;

  @prop({ type: String, enum: ['Admin', 'Public'], required: true })
  public Visibility?: string;

  @prop({ type: String, enum: ['Active', 'Inactive'], required: true })
  public Status!: string;

  @prop({ ref: () => Bag  })
  public Bags!: Ref<Bag>[];

  @prop({ ref: () => Coupon  })
  public Coupons!: Ref<Coupon>[];

  @prop({ type: () => [DeliveryDay], required: true })
  public DeliveryDays!: DeliveryDay[];

  @prop({ type: Number, required: true })
  public OriginalPrice!: number;

  @prop({ type: Number,default:0,required:false })
  public Offer?: number;

  @prop({ type: Number, required: true })
  public NetPrice!: number;

  @prop({ type: String, required: true })
  public ImageUrl!: string;

  @prop({ type: String, required: false })
  public Description!: string;
}

const SubscriptionModel = getModelForClass(Subscription);

export default SubscriptionModel;
