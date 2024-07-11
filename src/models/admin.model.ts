import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { SuperAdmin } from './superadmin.model';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Admin {
    @prop({ type: String, required: true, unique: true })
    public email: string;

    @prop({ type: String, required: true })
    public password: string;

    @prop({ type: String })
    public firstName?: string;

    @prop({ type: String })
    public lastName?: string;

    @prop({ type: String })
    public phoneNumber?: string;

    @prop({ type: String, ref: 'SuperAdmin', required: true })
    public superAdminId: Ref<SuperAdmin>;

    @prop({ type: String, default: 'admin' })
    public role: string;

    @prop({ type: Boolean, default: true })
    public isActive: boolean;

    @prop({ type: Date, required: true })
    public updatedAt: Date;

    @prop({ type: Date, required: true })
    public createdAt: Date;
}

const AdminModel = getModelForClass(Admin);

export default AdminModel;
