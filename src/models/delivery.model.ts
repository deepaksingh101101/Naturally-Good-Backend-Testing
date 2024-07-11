import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Delivery {

    @prop({ type: String, required: true })
    public deliveryId: string;

    @prop({ type: String, required: true })
    public orderId: string;

    @prop({ type: Date, required: true })
    public deliveryDate: Date;

    @prop({ type: String , required:true})
    public userId: string;

    @prop({ type: String, required: true })
    public deliveryPersonId: string;

    @prop({ type: String , required: true})
    public deliveryAddress?: string;

    @prop({ type: String})
    public deliveryStatus?: string;

    @prop({ type: Number})
    public trackingNumber: number;

    @prop({ type: String})
    public estimatedDeliveryTime: string;

    @prop({ type: String })
    public actualDeliveryTime: string;

    @prop({ type: String , required:true})
    public deliveryType: String;

    @prop({ type: Number })
    public deliveryFee: Number;
    
    @prop({ type: Number , required:true})
    public totalPrice: Number;

    @prop({ type: String, required: true })
    public updatedAt: string;

    @prop({ type: String, required: true })
    public createdAt: string;
}

const DeliveryModel = getModelForClass(Delivery);

export default DeliveryModel;
