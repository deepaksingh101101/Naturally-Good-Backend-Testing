import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

// Define the schema for the permission item
class PermissionItem {
    @prop({ required: true })
    public name!: string;
}

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Permission {
    @prop({ required: true })
    public moduleName!: string;

    @prop({
        type: () => [PermissionItem],
        required: true,
    })
    public permissions!: PermissionItem[];
}

const PermissionModel = getModelForClass(Permission);
export default PermissionModel;
