import { prop, getModelForClass, modelOptions, Ref, pre } from '@typegoose/typegoose';
import { Admin } from './oldrole.model';
import { Employee } from './employee.model';


@pre<ComplaintsType>('save', async function() {
    this.UpdatedAt = new Date();
  })

export class ComplaintsType {
    @prop({ type: String ,required: true})
    public ComplaintType!: string;

    @prop({ type:Boolean, required: false,default:true })
    public Status!: boolean;

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
