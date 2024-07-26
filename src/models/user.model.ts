import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

class Address {
  @prop({ type: String, required: false })
  public HouseNumber: string;

  @prop({ type: String, required: false })
  public City: string;

  @prop({ type: String, required: false })
  public State: string;

  @prop({ type: String, required: false })
  public ZipCode: string;
}

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @prop({ type: String, required: true })
  public userName: string;

  @prop({ type: String, required: true })
  public firstname: string;

  @prop({ type: String, required: true })
  public lastname: string;

  @prop({ type: Number, required: false })
  public phoneNo: number;

  @prop({ type: String, required: false })
  public password: string;

  @prop({ type: () => Address, required: false })
  public address: Address;

  @prop({ type: String })
  public email?: string;

  @prop({ type: Boolean, default: true })
  public accountStatus: boolean;

  @prop({ type: String, required:false })
  public assignedEmployee?: string;


  @prop({ type: String, default: () => new Date().toISOString() })
  public lastLogin: string;

  @prop({ type: String, required:false })
  public otp?: string;
  

  @prop({ type: Date, required:false })
  public otpExpiry?: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
