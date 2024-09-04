import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './user.model';

enum StatusType {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export class Complaints {

    @prop({ type: Date, required: true })
    public OrderId!: Date;

    @prop({ ref: () => User })
    public UserId?: Ref<User>;

    @prop({ type: String })
    public ComplaintType!: string;

    @prop({ enum: StatusType, required: true })
    public Status!: StatusType;

    @prop({ type: String })
    public Resolution?: string;

    @prop({ type: Number, default: 1 })
    public Description!: number;

    // @prop({ type: String })
    // public ComplimentDate?: string;

    @prop({ type: Date, default: Date.now })
    public CreatedAt!: Date;

    @prop({ type: Date, default: Date.now })
    public UpdatedAt!: Date;
}
const ComplimentsModel = getModelForClass(Complaints);
export default ComplimentsModel;
