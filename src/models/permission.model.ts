import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { SuperAdmin } from './superadmin.model'; // Adjust the path as needed
import { Types } from 'mongoose';

// Define the schema for individual permission items
export class PermissionItem {
    @prop({ required: true })
    public name!: string;

    @prop({ required: false })
    public href!: string;

    @prop({ Type:Boolean, required: false })
    public isInSidebar!: boolean;

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

    @prop({ required: false })
    public icon!: string;
}

const PermissionModel = getModelForClass(Permission);
export default PermissionModel;