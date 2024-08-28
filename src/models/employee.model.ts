import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import { User } from './user.model';

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

    @prop({ ref: () => User  })
    public AssignedCustomers!: Ref<User>[];

    @prop({ required: true })
    public Role!: string;

    @prop({ default: true })
    public isActive!: boolean;

    @prop({ required: true })
    public UpdatedAt!: Date;

    @prop({ required: true })
    public CreatedAt!: Date;

    public async hashPassword(Password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(Password, saltRounds);
    }

    public async validatePassword(Password: string): Promise<boolean> {
        return await bcrypt.compare(Password, this.Password);
    }
}

const EmployeeModel = getModelForClass(Employee);
export default EmployeeModel;
