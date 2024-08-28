import { prop, getModelForClass, pre, Ref } from '@typegoose/typegoose';
import { Admin } from './oldrole.model';

@pre<Plan>('save', function() {
  this.UpdatedAt = new Date();
})
class Plan {

    @prop({ type: String, required: true })
    public SubscriptionPlan!: string;

    @prop({ type: String, required: false })
    public PlanDetail?: string;

    @prop({ type: Date, required: true, default:Date.now() })
    public CreatedAt!: Date;

    @prop({ type: Date, default:Date.now()})
    public UpdatedAt!: Date;

    @prop({ type: Boolean, required: true,default:true })
    public Status!: Boolean;

    @prop({ ref: () => Admin })
    public createdBy!: Ref<Admin>;
}

const PlanModel = getModelForClass(Plan);

export default PlanModel;
