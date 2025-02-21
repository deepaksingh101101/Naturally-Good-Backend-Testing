import { getModelForClass, pre, prop, Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Subscription } from './subscription.model';
import { Order } from './order.model';

@pre<Feedback>('save', async function () {
  this.UpdatedAt = new Date();
})
class Feedback {
  @prop({ required: true })
  public Feedback!: string;

  @prop({ type: Number, required: true })
  public RatingValue!: number;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => User, required: true })
  public CreatedBy!: Ref<User>;

  @prop({ ref: () => User })
  public UpdatedBy!: Ref<User>;

  @prop({ ref: () => Order })
  public Subscription!: Ref<Order>;


}

const FeedbackModel = getModelForClass(Feedback);

export default FeedbackModel;
