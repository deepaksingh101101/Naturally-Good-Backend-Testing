import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose';
import { Admin } from './role.model';

enum StatusType {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

@modelOptions({
    schemaOptions: {
        timestamps: { createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' }
    }
})
class ComplimentsType {

    @prop({ type: String })
    public ComplaintType!: string;

    @prop({ enum: StatusType, required: true })
    public Status!: StatusType;

    @prop({ type: String })
    public Resolution?: string;

    @prop({ type: String })
    public Description?: string;

    @prop({ ref: () => Admin })
    public CreatedBy!: Ref<Admin>;

    // Timestamps are automatically handled by @modelOptions
    public CreatedAt!: Date;
    public UpdatedAt!: Date;
}

const ComplimentsTypeModel = getModelForClass(ComplimentsType);
export default ComplimentsTypeModel;
