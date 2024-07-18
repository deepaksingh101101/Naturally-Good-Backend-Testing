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

    @prop({ type: String, required:true })
    public UserId!: string;

    @prop({ type: String})
    public SubscriptionId!: string;

    @prop({ type: Date })
    public PaymentDate!: Date;

    @prop({ type: Number, required: true })
    public PaymentAmount!: number;

    @prop({ type: String, enum: PaymentMethod, required: true })
    public PaymentMethod!: PaymentMethod;

    @prop({ type: String, enum: PaymentStatus, required: false })
    public PaymentStatus?: PaymentStatus;

    @prop({ type: Boolean, default: false })
    public PaymentConfirmation!: boolean;

    @prop({ type: Date, default: Date.now })
    public CreatedAt!: Date;

    @prop({ type: Date, default: Date.now })
    public UpdatedAt!: Date;
}

const PaymentModel = getModelForClass(Payment);

export default PaymentModel;
