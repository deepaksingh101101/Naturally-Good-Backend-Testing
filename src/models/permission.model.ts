import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { SuperAdmin } from './superadmin.model'; // Adjust the path as needed
import { Types } from 'mongoose';

// Define the schema for individual permission items
export class PermissionItem {
    @prop({ required: true })
    public name!: string;

    // Include the `_id` property
    public _id!: Types.ObjectId;
}

@ModelOptions({
    schemaOptions: {
        timestamps: true, // This ensures createdAt and updatedAt fields are automatically added
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