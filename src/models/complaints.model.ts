import { prop, getModelForClass } from '@typegoose/typegoose';

class Compliments {
    @prop({ type: String, required: true })
    public complimentId!: string;

    @prop({ type: Date, required: true })
    public orderId!: Date;

    @prop({ type: Number, required: true })
    public userId!: number;

    @prop({ type: String })
    public complaintType!: string;

    @prop({ type: Number, default: 1 })
    public description!: number;

    @prop({ type: String, required: true })
    public status!: string;

    @prop({ type: String })
    public resolution?: string;

    @prop({ type: String })
    public complimentDate?: string;

    @prop({ type: Date, default: Date.now })
    public createdAt!: Date;

    @prop({ type: Date, default: Date.now })
    public updatedAt!: Date;
}
const ComplimentsModel = getModelForClass(Compliments);
export default ComplimentsModel;
