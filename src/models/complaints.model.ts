import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Employee } from './employee.model';
import { ComplaintsType } from './complaintsType.model';
import { Delivery } from './delivery.model';

export enum StatusType {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

 export enum ResolutionType {
    ADDONBAG = 'addonbag',
    COUPON = 'coupon'
}

export class Complaints {

    @prop({ ref: () => Delivery })
    public DeliveryId?: Ref<Delivery>;

    @prop({ ref: () => User })
    public UserId?: Ref<User>;

    @prop({ ref: () => ComplaintsType })
    public ComplaintTypeId?: Ref<ComplaintsType>;

    @prop({ enum: StatusType, required: true,default:'active' })
    public Status!: StatusType;

    @prop({ enum: ResolutionType })
    public Resolution?: ResolutionType;

    @prop({ type: Number, default: 1 })
    public Description!: number;

    @prop({ type: Date, default: Date.now })
    public UpdatedAt!: Date;
  
    @prop({ type: Date, default: Date.now })
    public CreatedAt!: Date;
  
    @prop({ ref: () => Employee })
    public CreatedBy!: Ref<Employee>;
  
    @prop({ ref: () => Employee })
    public UpdatedBy!: Ref<Employee>;
}
const ComplaintModel = getModelForClass(Complaints);
export default ComplaintModel;
