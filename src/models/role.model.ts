import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { PermissionItem } from './permission.model'; // Adjust the path as needed
import { SuperAdmin } from './superadmin.model'; // Adjust the path as needed
import { Types } from 'mongoose';

@ModelOptions({
    schemaOptions: {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    },
})
export class Role {
    @prop({ required: true, unique: true })
    public roleName!: string;

    @prop({ ref: () => SuperAdmin, required: false })
    public createdBy!: Ref<SuperAdmin>;

    @prop({ ref: () => SuperAdmin })
    public updatedBy?: Ref<SuperAdmin>;

    @prop({
        type: () => [Object], // Define permissions as an array of objects
        default: [], // Initialize as an empty array
    })
    public permissions!: {
        permission: Ref<PermissionItem>;
        details: {
            actionName: string;
            isAllowed: boolean;
            href:string,
            isInSidebar:boolean
        }[];
        icon:string
    }[];
}

const RoleModel = getModelForClass(Role);
export default RoleModel;
