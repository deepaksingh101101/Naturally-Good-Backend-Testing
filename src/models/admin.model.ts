// import { getModelForClass, ModelOptions, prop, pre } from '@typegoose/typegoose';
// import bcrypt from 'bcrypt';

// enum Role {
//   ADMIN = 'admin',
//   SUPERADMIN = 'superadmin'
// }

// @pre<Admin>('save', async function() {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
// })
// @ModelOptions({
//   schemaOptions: {
//     timestamps: true,
//   },
// })
// class Admin {
//   @prop({ type: String, required: true })
//   public firstname: string;

//   @prop({ type: String, required: true })
//   public lastname: string;

//   @prop({ type: Number, required: true })
//   public phoneNo: number;

//   @prop({ type: String, required: true })
//   public password: string;

//   @prop({ type: String, required: true, unique: true })
//   public email: string;

//   @prop({ type: Boolean, default: true })
//   public accountStatus: boolean;

//   @prop({ type: String, default: () => new Date().toISOString() })
//   public lastLogin: string;

//   @prop({ type: String, enum: Role, required: true })
//   public role: Role;

//   public async comparePassword(candidatePassword: string): Promise<boolean> {
//     return bcrypt.compare(candidatePassword, this.password);
//   }
// }

// const AdminModel = getModelForClass(Admin);

// export default AdminModel;
// src/models/admin.ts

import { getModelForClass, ModelOptions, prop, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

enum Role {
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

@pre<Admin>('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
})
@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Admin {
  @prop({ type: String, required: true })
  public firstname!: string;

  @prop({ type: String, required: true })
  public lastname!: string;

  @prop({ type: Number, required: true })
  public phoneNo!: number;

  @prop({ type: String, required: true })
  public password!: string;

  @prop({ type: String, required: true, unique: true })
  public email!: string;

  @prop({ type: Boolean, default: true })
  public accountStatus?: boolean;

  @prop({ type: String, default: () => new Date().toISOString() })
  public lastLogin?: string;

  @prop({ type: String, enum: Role, required: true })
  public role!: Role;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

const AdminModel = getModelForClass(Admin);

export default AdminModel;
