import { prop, getModelForClass } from '@typegoose/typegoose';

class ProductManagement {
    @prop({ type: String, required: true })
    public productID!: string;

    @prop({ type: String, required: true })
    public productName!: string;

    @prop({ type: Date, required: true })
    public orderDate!: Date;

    @prop({ type: Object, required: true })
    public type!: object;

    @prop({ type: String, required: false })
    public group?: string;

    @prop({ type: String, required: false })
    public season?: string;

    @prop({ type: String, required: false })
    public priority?: string;

    @prop({ type: Number, required: false })
    public roster?: number;

    @prop({ type: String, required: true })
    public veggieNameInHindi!: string;

    @prop({ type: Number, required: true })
    public unitQuantity!: number;

    @prop({ type: Number, required: false })
    public pieces?: number;

    @prop({ type: String, required: true })
    public updatedAt!: string; 

    @prop({ type: String, required: true })
    public createdAt!: string;
}

const ProductManagementModel = getModelForClass(ProductManagement);

export default ProductManagementModel;
