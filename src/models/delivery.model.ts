import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class DeliveryGuy {
    @prop({ required: true, unique: true })
    public email!: string;

    @prop({ required: true })
    public password!: string;

    @prop({ required: true })
    public firstName!: string;

    @prop({ required: true })
    public lastName!: string;

    @prop({ required: true })
    public phoneNumber!: string;

    @prop({ required: true })
    public adminId!: string;

    @prop({ required: true, enum: ['delivery_guy'] })
    public role!: string;

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

    public async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}

const DeliveryGuyModel = getModelForClass(DeliveryGuy);
export default DeliveryGuyModel;
