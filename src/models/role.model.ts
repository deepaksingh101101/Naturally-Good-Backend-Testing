import { getModelForClass, ModelOptions, prop, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
@pre<Admin>('save', async function() {
    if (this.isModified('Password')) {
        this.Password = await this.hashPassword(this.Password);
    }
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

    @prop({ required: true, enum: ['Admin', 'Subadmin'] })
    public Role!: string;

    @prop({ default: true })
    public isActive!: boolean;

    public async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    public async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.Password);
    }
}

const AdminModel = getModelForClass(Admin);
export default AdminModel;
