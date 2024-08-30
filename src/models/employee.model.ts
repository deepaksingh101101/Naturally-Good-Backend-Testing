import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import { Role } from './role.model'; // Adjust the path as needed

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Employee {
    @prop({ required: true })
    public FirstName!: string;

    @prop({ required: true })
    public LastName!: string;

    @prop({ required: true })
    public PhoneNumber!: string;

    @prop({ required: true, unique: true })
    public Email!: string;

    @prop({ required: false })
    public Password?: string;

    @prop({ required: true })
    public Dob!: Date;

    @prop({ required: true })
    public Gender!: string;

    @prop({ required: true })
    public StreetAddress!: string;

    @prop({ required: true })
    public City!: string;

    @prop({ required: true })
    public State!: string;

    @prop({ ref: () => Role, required: false })
    public Role!: Ref<Role>;

    // Updated to only reference Employee
    @prop({ ref: () => Employee, required: false })
    public CreatedBy?: Ref<Employee>;

    // Removed enum restriction since only Employee can be the creator
    @prop({ required: false })
    public CreatedByModel?: 'Employee';

    @prop({ default: true })
    public isActive!: boolean;

    public async hashPassword(Password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(Password, saltRounds);
    }

    public async validatePassword(Password: string): Promise<boolean> {
        return await bcrypt.compare(Password, this.Password!);
    }
}

const EmployeeModel = getModelForClass(Employee);
export default EmployeeModel;
