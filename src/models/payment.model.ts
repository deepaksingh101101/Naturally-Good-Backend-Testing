import { prop, getModelForClass } from '@typegoose/typegoose';

export enum PaymentMethod {
    CreditCard = 'Credit Card',
    PayPal = 'PayPal',
    BankTransfer = 'Bank Transfer',
    Cash = 'Cash',
    Other = 'Other'
}

export enum PaymentStatus {
    InProgress = 'inprogress',
    Approved = 'approved',
    Reject = 'reject'
}
class Payment {

    @prop({ type: String, required: true })
    public paymentId!: string;

    @prop({ type: String, required:true })
    public UserId!: string;

    @prop({ type: String})
    public subscriptionId!: string;

    @prop({ type: Date })
    public paymentDate!: Date;

    @prop({ type: Number, required: true })
    public paymentAmount!: number;

    @prop({ type: String, enum: PaymentMethod, required: true })
    public paymentMethod!: PaymentMethod;

    @prop({ type: String, enum: PaymentStatus, required: false })
    public paymentStatus?: PaymentStatus;

    @prop({ type: Boolean, default: false })
    public paymentConfirmation!: boolean;

    @prop({ type: Date, default: Date.now })
    public createdAt!: Date;

    @prop({ type: Date, default: Date.now })
    public updatedAt!: Date;
}

const PaymentModel = getModelForClass(Payment);

export default PaymentModel;
