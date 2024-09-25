import { getModelForClass, ModelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { Employee } from './employee.model';
import { Subscription } from './subscription.model';
import { User } from './user.model';


class AssignedToSchema {
  @prop({ ref: () => User, required: true }) // Ensure that ref is specified correctly
  public Users!: Ref<User>;
}

@pre<Coupon>('save', async function() {
  this.UpdatedAt = new Date();
})

export class Coupon {
  // Coupon Type - Enum
  @prop({ type: String, enum: ['Normal', 'Subscription','Referred'], required: true })
  public CouponType: 'Normal' | 'Subscription' | 'Referred';

  @prop({ type: String, enum: ['Normal', 'FreeDelivery', 'CelebrityType', 'SeasonSpecial', 'Referred'], required: true })
  public CouponCategory: 'Normal' | 'FreeDelivery' | 'CelebrityType' | 'SeasonSpecial' | 'Referred';

  // Coupon Code
  @prop({ type: String, required: true })
  public Code: string;

  // Discount Type - Enum
  @prop({ type: String, enum: ['Percentage', 'FixedAmount'], required: false })
  public DiscountType: 'Percentage' | 'FixedAmount';

  @prop({ type: String, enum: ['Active', 'Inactive'], required: true,default:"Active" })
  public Status: 'Active' | 'Inactive';

  // Discount Percentage (if applicable)
  @prop({ type: Number })
  public DiscountPercentage?: number;

  // Discount Price (if applicable)
  @prop({ type: Number })
  public DiscountPrice?: number;

  // Validity Type - Enum
  @prop({ type: String, enum: ['DateRange', 'NoRange'], required: true })
  public ValidityType: 'DateRange' | 'NoRange';

  // Coupon Start Date
  @prop({ type: Date })
  public StartDate: Date;

  // Coupon End Date
  @prop({ type: Date })
  public EndDate: Date;

  // Number of Times a Coupon Can Be Applied Per User
  // @prop({ type: Number, default: 1 })
  // public NumberOfTimesCanBeAppliedPerUser?: number;

  // Coupon Visibility - Enum
  @prop({ type: String, enum: ['Admin', 'Public', 'Private'], required: true, default: "Private" })
  public CouponVisibility: 'Admin' | 'Public' | 'Private';

  // Description
  @prop({ type: String })
  public Description?: string;

  // Description
  @prop({ type: String })
  public CouponsName?: string;

  // Image URL
  @prop({ type: String })
  public ImageUrl?: string;

  // Assigned To
  @prop({ type: Boolean,default:false })
  public ReferredTo?: boolean;

  // Assigned By
  @prop({ type: Boolean,default:false })
  public ReferredBy?: boolean;

  // Revenue Generated
  @prop({ type: Number })
  public RevenueGenerated?: number;

  // Number of Times Used
  @prop({ type: Number })
  public NumberOfTimesUsed?: number;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Employee })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee })
  public UpdatedBy!: Ref<Employee>;

  // Subscription IDs - Array of references
  @prop({ ref: () => Subscription, required: false })
  public Subscriptions!: Ref<Subscription>[];


  @prop({ type: () => [AssignedToSchema] }) // Array of subdocuments
  public AssignedTo?: AssignedToSchema[];

    // User IDs - Array of references
@prop({ ref: () => User, required: false })
public UsedBy!: Ref<User>[];


}

// Export CouponModel
const CouponModel = getModelForClass(Coupon);

export default CouponModel;
