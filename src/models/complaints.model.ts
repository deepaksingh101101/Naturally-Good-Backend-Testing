import { prop, getModelForClass } from '@typegoose/typegoose';

class Compliments {

    @prop({ type: Date, required: true })
    public OrderId!: Date;

    @prop({ type: Number, required: true })
    public UserId!: number;

    @prop({ type: String })
    public ComplaintType!: string;

    @prop({ type: Number, default: 1 })
    public Description!: number;

    @prop({ type: String, required: true })
    public Status!: string;

    @prop({ type: String })
    public Resolution?: string;

    @prop({ type: String })
    public ComplimentDate?: string;

    @prop({ type: Date, default: Date.now })
    public CreatedAt!: Date;

    @prop({ type: Date, default: Date.now })
    public UpdatedAt!: Date;
}
const ComplimentsModel = getModelForClass(Compliments);
export default ComplimentsModel;
