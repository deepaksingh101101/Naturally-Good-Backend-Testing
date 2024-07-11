import { getModelForClass, ModelOptions, prop, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
@pre<SuperAdmin>('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
export class SuperAdmin {
    @prop({ type: String, required: true, unique: true })
    public email: string;

    @prop({ type: String, required: true })
    public password: string;

    @prop({ type: String, required: true })
    public role: string;

    @prop({ type: Boolean, default: true })
    public isActive: boolean;

    @prop({ type: Date, required: false })
    public updatedAt: Date;

    @prop({ type: Date, required: false })
    public createdAt: Date;

    public async validatePassword(inputPassword: string): Promise<boolean> {
        return await bcrypt.compare(inputPassword, this.password);
    }
}

const SuperAdminModel = getModelForClass(SuperAdmin);

export default SuperAdminModel;
