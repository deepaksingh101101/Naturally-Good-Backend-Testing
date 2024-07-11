import { prop, getModelForClass } from '@typegoose/typegoose';

class Employee {
    @prop({ type: String, required: true })
    public employeeId!: string;

    @prop({ type: String, required: true })
    public fullName!: string;

    @prop({ type: Object, required: true })
    public role!: object;

    @prop({ type: Number, required: false })
    public assignedUsers?: number;

    @prop({ type: Number, required: true })
    public contactInformation!: number;

    @prop({ type: Date, default: Date.now })
    public createdAt!: Date;

    @prop({ type: Date, default: Date.now })
    public updatedAt!: Date;
}

const EmployeeModel = getModelForClass(Employee);
export default EmployeeModel;
