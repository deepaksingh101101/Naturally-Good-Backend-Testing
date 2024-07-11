import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Seller {

    @prop({ type: String, required: true })
    public supplierId: string;

    @prop({ type: String, required: true })
    public sellerName: string;

    @prop({ type: String, required: true })
    public shopName: string;

    @prop({ type: String })
    public email: string;

    @prop({ type: Number, required: true })
    public mobileNo: number;

    @prop({ type: String , required: true})
    public address?: string;

    @prop({ type: String , required:true})
    public state?: string;

    @prop({ type: Number, required: true })
    public pinCode: number;

    @prop({ type: String})
    public supplierType: string;

    @prop({ type: Number })
    public rating: number;

    @prop({ type: String })
    public bankaccountDetails: String;

    @prop({ type: String, required: true })
    public updatedAt: string;

    @prop({ type: String, required: true })
    public createdAt: string;
}

const SellerModel = getModelForClass(Seller);

export default SellerModel;
