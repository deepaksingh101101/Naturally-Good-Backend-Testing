import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { Permission } from './permission.model'; // Adjust the path as needed
import { SuperAdmin } from './superadmin.model';

@ModelOptions({
    schemaOptions: {
        timestamps: true, // This ensures createdAt and updatedAt fields are automatically added
    },
})
export class Role {
    @prop({ required: true, unique: true })
    public roleName!: string;

    // Reference to the Permission model
    @prop({ ref: () => Permission, required: true })
    public permissions!: Ref<Permission>[];

    // Created by reference to an Admin or User
    @prop({ ref: () => SuperAdmin, required: true })
    public createdBy!: Ref<SuperAdmin>;

    // Updated by reference to an Admin or User
    @prop({ ref: () => SuperAdmin })
    public updatedBy?: Ref<SuperAdmin>;

    // The timestamps createdAt and updatedAt are automatically managed by Mongoose
}

const RoleModel = getModelForClass(Role);
export default RoleModel;
