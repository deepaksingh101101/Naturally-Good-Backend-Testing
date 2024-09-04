import { getModelForClass, ModelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { Employee } from './employee.model';
import { SourceOfCustomer, TypeOfCustomer } from './dropdown.model';
import { Coupon } from './coupons.model';
import { City } from './route.model';
import { Order } from './order.model';

@pre<User>('save', async function() {
  this.UpdatedAt = new Date();
})

// Address Sub document
class Address {
  @prop({ type: String })
  public HouseNumber?: string;

  @prop({ type: String })
  public SocietyLocality?: string;

  @prop({ type: String })
  public Sector?: string;

  @prop({ ref: () => City, required: false })
  public City?: Ref<City>;

  @prop({ type: String })
  public State?: string;

  @prop({ type: String })
  public ZipCode?: string;

}

// Family Member Subdocument
class FamilyMember {

  @prop({ type: String })
  public Name!: string;

  @prop({ type: Number })
  public Height?: number;

  @prop({ type: Number })
  public Weight?: number;

  @prop({ type: Date })
  public Dob?: Date;

  @prop({ type: String })
  public Gender?: string;

  @prop({ type: String })
  public Allergies?: string;
}

// Main User Model
export class User {
  @prop({ type: String })
  public FirstName!: string;

  @prop({ type: String })
  public LastName!: string;

  @prop({
    type: Number,
    validate: {
      validator: function (v: number) {
        return /^(\+91)?[6-9]\d{9}$/.test(v.toString());
      },
      message: 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9'
    }
  })
  public Phone!: number;

  @prop({ type: () => Address, required: false })
  public Address?: Address;

  @prop({ type: String })
  public Email?: string;

  @prop({ type: String })
  public Profile?: string;

  @prop({ type: Number,
    validate: {
      validator: function (v: number) {
        return /^(\+91)?[6-9]\d{9}$/.test(v.toString());
      },
      message: 'Phone number must be a 10-digit number starting with 6, 7, 8, or 9'
    }
   })
  public AlternateContactNumber?: number;

  @prop({ type: String })
  public Allergies?: string;


  @prop({ type: Date })
  public DOB?: Date;

  @prop({ type: Number })
  public Height?: number;

  @prop({ type: Number })
  public Weight?: number;

  @prop({ type: String })
  public Preferences?: string;

  @prop({ type: String })
  public Gender?: string; // Could be enum or string

  @prop({ enum: ['2-3-Times', '3-5-Times', 'MoreThan5'] })
  public HowOftenYouCookedAtHome?: string;

  @prop({ type: String })
  public WhatDoYouUsuallyCook?: string;

  @prop({ type: String })
  public AlternateAddress?: string;

  @prop({ type: [FamilyMember] })
  public FamilyMembers?: FamilyMember[];

  @prop({ type: String })
  public ExtraNotes?: string;

  @prop({ type: String })
  public ReferredCode?: string;

  @prop({ ref: () => User, required: false })
  public ReferredBy?: Ref<User>;

  @prop({ ref: () => Employee, required: false })
  public AssignedEmployee?: Ref<Employee>;

  @prop({ ref: () => SourceOfCustomer, required: false })
  public Source?: Ref<SourceOfCustomer>;

  @prop({ ref: () => TypeOfCustomer, required: false })
  public CustomerType?: Ref<TypeOfCustomer>;

  @prop({ ref: () => Coupon })
  public Coupons?: Array<{
    Coupon: Ref<Coupon>;
    IsUsed?: boolean;
  }>;


  @prop({ ref: () => Order, required: false })
  public CurrentSubscription?: Ref<Order>;

  // // Authentication Fields
  // @prop({ type: String, required: false })
  // public Password!: string;

  @prop({ type: Boolean, default: true })
  public AccountStatus!: boolean;

  @prop({ type: String, default: () => new Date().toISOString() })
  public LastLogin?: string;

  @prop({ type: Boolean, default:false })
  public isUserVerified?: boolean;

  @prop({ type: String })
  public Otp?: string;

  @prop({ type: Date })
  public OtpExpiry?: Date;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Employee })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee })
  public UpdatedBy!: Ref<Employee>;

}

// Export UserModel
const UserModel = getModelForClass(User);

export default UserModel;
