import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

class Address {
  @prop({ type: String, required: true })
  public HouseNumber: string;

  @prop({ type: String, required: true })
  public City: string;

  @prop({ type: String, required: true })
  public State: string;

  @prop({ type: String, required: true })
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

  @prop({ type: Number, required: true })
  public phoneNo: number;

  @prop({ type: String, required: true })
  public password: string;

  @prop({ type: () => Address, required: true })
  public address: Address;

  @prop({ type: String })
  public email?: string;

  @prop({ type: Boolean, default: true })
  public accountStatus: boolean;

  @prop({ type: String, default: () => new Date().toISOString() })
  public lastLogin: string;

  @prop({ type: String })
  public otp?: string;

  @prop({ type: Date })
  public otpExpiry?: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
