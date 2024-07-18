import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Seller {

    @prop({ type: String, required: true })
    public SellerName: string;

    @prop({ type: String, required: true })
    public ShopName: string;

    @prop({ type: String })
    public Email: string;

    @prop({ type: Number, required: true })
    public MobileNo: number;

    @prop({ type: String , required: true})
    public Address?: string;

    @prop({ type: String , required:true})
    public State?: string;

    @prop({ type: Number, required: true })
    public PinCode: number;

    @prop({ type: String})
    public SupplierType: string;

    @prop({ type: Number })
    public Rating: number;

    @prop({ type: String })
    public BankaccountDetails: String;

    @prop({ type: String, required: true })
    public UpdatedAt: string;

    @prop({ type: String, required: true })
    public CreatedAt: string;
}

const SellerModel = getModelForClass(Seller);

export default SellerModel;
