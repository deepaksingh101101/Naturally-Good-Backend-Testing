import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import { Employee } from './employee.model';
import { SourceOfCustomer, TypeOfCustomer } from './dropdown.model';

// Address Subdocument
class Address {
  @prop({ type: String })
  public HouseNumber?: string;

  @prop({ type: String })
  public SocietyLocality?: string;

  @prop({ type: String })
  public Sector?: string;

  @prop({ type: String })
  public City?: string;

  @prop({ type: String })
  public State?: string;

  @prop({ type: String })
  public ZipCode?: string;

  @prop({ type: String })
  public AlternateAddress?: string;
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

// ReferredTo Subdocument
class ReferredTo {
  @prop({ ref: () => User })
  public UserId!: Ref<User>;

  @prop({ type: Date })
  public ReferredDate!: Date;

  @prop({ type: Boolean })
  public IsLogedin?: boolean;

  @prop({ type: Boolean })
  public IsPurchased?: boolean;
}

// Main User Model
export class User {
  @prop({ type: String })
  public FirstName!: string;

  @prop({ type: String })
  public LastName!: string;

  @prop({ type: Number })
  public Phone!: number;

  @prop({ type: () => Address, required: false })
  public Address?: Address;

  @prop({ type: String })
  public Email?: string;

  @prop({ type: Number })
  public AlternateContactNumber?: number;

  @prop({ type: String })
  public Allergies?: string;

  @prop({ type: Number })
  public NumberOfFamilyMembers?: number;

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

  @prop({ type: [FamilyMember] })
  public FamilyMembers?: FamilyMember[];

  @prop({ type: String })
  public ExtraNotes?: string;

  @prop({ type: String, unique: true })
  public ReferredCode?: string;

  @prop({ type: [ReferredTo] })
  public ReferredTo?: ReferredTo[];

  @prop({ ref: () => Employee, required: false })
  public AssignedEmployee?: Ref<Employee>;

  @prop({ ref: () => SourceOfCustomer, required: false })
  public Source?: Ref<SourceOfCustomer>;

  @prop({ ref: () => TypeOfCustomer, required: false })
  public CustomerType?: Ref<TypeOfCustomer>;

  // @prop({ ref: () => Coupons })
  // public Coupons?: Array<{
  //   coupon: Ref<any>;
  //   isUsed?: boolean;
  //   isExpired?: boolean;
  // }>;

  // Authentication Fields
  @prop({ type: String, required: true })
  public Password!: string;

  @prop({ type: Boolean, default: true })
  public AccountStatus!: boolean;

  @prop({ type: String, default: () => new Date().toISOString() })
  public lastLogin?: string;

  @prop({ type: String })
  public otp?: string;

  @prop({ type: Date })
  public otpExpiry?: Date;

  // Methods
  // public async comparePassword(candidatePassword: string): Promise<boolean> {
  //   return bcrypt.compare(candidatePassword, this.Password);
  // }
}

// Export UserModel
const UserModel = getModelForClass(User);

export default UserModel;
