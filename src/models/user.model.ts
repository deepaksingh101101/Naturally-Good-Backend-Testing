import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

class Address {
  @prop({ type: String, required: false })
  public HouseNumber: string;

  @prop({ type: String, required: false })
  public SocietyLocality: string;

  @prop({ type: String, required: false })
  public Sector: string;

  @prop({ type: String, required: false })
  public City: string;

  @prop({ type: String, required: false })
  public State: string;

  @prop({ type: String, required: false })
  public ZipCode: string;

  @prop({ type: String, required: false })
  public AlternateAddress?: string;
}

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  // @prop({ type: String, required: true })
  // public UserName: string;

  @prop({ type: String, required: true })
  public FirstName: string;

  @prop({ type: String, required: true })
  public LastName: string;

  @prop({ type: Number, required: false })
  public PhoneNo: number;

  @prop({ type: String, required: false })
  public Password: string;

  @prop({ type: () => Address, required: false })
  public Address: Address;

  @prop({ type: String })
  public Email?: string;

  @prop({ type: Boolean, default: true })
  public AccountStatus: boolean;

  @prop({ type: String, required: false })
  public AssignedEmployee?: string;

  @prop({ type: String, default: () => new Date().toISOString() })
  public lastLogin: string;

  @prop({ type: String, required: false })
  public otp?: string;

  @prop({ type: Date, required: false })
  public otpExpiry?: Date;

  // New fields for customer information
  @prop({ type: String, required: true })
  public contactNumber: string;

  @prop({ type: String, required: false })
  public alternateContactNumber?: string;

  @prop({ type: String, required: false })
  public allergies?: string;

  @prop({ type: Number, required: false })
  public numberOfFamilyMembers?: number;

  @prop({ type: Date, required: false })
  public dateOfBirth?: Date;

  @prop({ type: String, required: false })
  public gender?: string;

  // public async comparePassword(candidatePassword: string): Promise<boolean> {
    // return bcrypt.compare(candidatePassword, this.password);
  // }
}

const UserModel = getModelForClass(User);

export default UserModel;
