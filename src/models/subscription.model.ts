import { getModelForClass, ModelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { FrequencyType, SubscriptionType } from './dropdown.model';
import { Bag } from './bag.model';
import { Coupon } from './coupons.model';
import { Employee } from './employee.model';

@pre<Subscription>('save', async function() {
  this.UpdatedAt = new Date();
})

class DeliveryDay {
  @prop({ type: String, required: true })
  public day!: string;
}

export class Subscription {

  @prop({ ref: () => SubscriptionType })
  public SubscriptionTypeId!: Ref<SubscriptionType>;

  @prop({ ref: () => FrequencyType })
  public FrequencyId!: Ref<FrequencyType>;

  @prop({ type: Number, required: true })
  public TotalDeliveryNumber!: number;

  @prop({ type: String, enum: ['Admin', 'Public'], required: true })
  public Visibility?: string;

  @prop({ type: Boolean, required: true })
  public Status!: boolean; // Changed from string enum to boolean

  @prop({ ref: () => Bag }) // Changed from array to single reference
  public Bag!: Ref<Bag>;

  @prop({ ref: () => Coupon })
  public Coupons!: Ref<Coupon>[];

  @prop({ type: () => [DeliveryDay], required: true })
  public DeliveryDays!: DeliveryDay[];

  @prop({ type: Number, required: true })
  public OriginalPrice!: number;

  @prop({ type: Number, default: 0, required: false })
  public Offer?: number;

  @prop({ type: Number, required: true })
  public NetPrice!: number;

  @prop({ type: String, required: true })
  public ImageUrl!: string;

  @prop({ type: String, required: false })
  public Description!: string;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Employee })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee })
  public UpdatedBy!: Ref<Employee>;

}

const SubscriptionModel = getModelForClass(Subscription);

export default SubscriptionModel;
