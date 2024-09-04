import { prop, getModelForClass, modelOptions, Ref, pre } from '@typegoose/typegoose';
import { Admin } from './oldrole.model';
import { Employee } from './employee.model';

export enum StatusType {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

@pre<ComplaintsType>('save', async function() {
    this.UpdatedAt = new Date();
  })

class ComplaintsType {
    @prop({ type: String ,required: true})
    public ComplaintType!: string;

    @prop({ enum: StatusType, required: false,default:true })
    public Status!: StatusType;

    @prop({ type: String })
    public Description?: string;

    @prop({ type: Date, default: Date.now })
    public UpdatedAt!: Date;
  
    @prop({ type: Date, default: Date.now })
    public CreatedAt!: Date;
  
    @prop({ ref: () => Employee })
    public CreatedBy!: Ref<Employee>;
  
    @prop({ ref: () => Employee })
    public UpdatedBy!: Ref<Employee>;
}

const ComplaintsTypeModel = getModelForClass(ComplaintsType);
export default ComplaintsTypeModel;
