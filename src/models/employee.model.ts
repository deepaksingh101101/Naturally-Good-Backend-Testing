import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class DeliveryGuy {
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
    public AdminId!: string;

    @prop({ required: true, enum: ['delivery_guy'] })
    public Role!: string;

    @prop({ default: true })
    public isActive!: boolean;

    @prop({ required: true })
    public UpdatedAt!: Date;

    @prop({ required: true })
    public CreatedAt!: Date;

    public async hashPassword(Password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(Password, saltRounds);
    }

    public async validatePassword(Password: string): Promise<boolean> {
        return await bcrypt.compare(Password, this.Password);
    }
}

const DeliveryGuyModel = getModelForClass(DeliveryGuy);
export default DeliveryGuyModel;
