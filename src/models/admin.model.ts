import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Admin {
    @prop({ required: true, unique: true })
    public Email!: string;

    @prop({ required: true })
    public Password!: string;

    @prop({ required: true })
    public FirstName!: string;

    @prop({ required: true })
    public LastName!: string;

    @prop({ required: true })
    public PhoneNumber!: string;

    @prop({ required: true })
    public SuperAdminId!: string;

    @prop({ required: true, enum: ['admin'] })
    public Role!: string;

    @prop({ default: true })
    public isActive!: boolean;

    @prop({ required: true })
    public updatedAt!: Date;

    @prop({ required: true })
    public createdAt!: Date;

    public async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    public async validatePassword(Password: string): Promise<boolean> {
        return await bcrypt.compare(Password, this.Password);
    }
}

const AdminModel = getModelForClass(Admin);
export default AdminModel;
