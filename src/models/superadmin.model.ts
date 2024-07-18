import { getModelForClass, ModelOptions, prop, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
@pre<SuperAdmin>('save', async function(next) {
    if (!this.isModified('Password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
})
export class SuperAdmin {
    @prop({ type: String, required: true, unique: true })
    public Email: string;

    @prop({ type: String, required: true })
    public Password: string;

    @prop({ type: String, required: true })
    public Role: string;

    @prop({ type: Boolean, default: true })
    public isActive: boolean;

    @prop({ type: Date, required: false })
    public updatedAt: Date;

    @prop({ type: Date, required: false })
    public createdAt: Date;

    public async validatePassword(inputPassword: string): Promise<boolean> {
        return await bcrypt.compare(inputPassword, this.Password);
    }
}

const SuperAdminModel = getModelForClass(SuperAdmin);

export default SuperAdminModel;
