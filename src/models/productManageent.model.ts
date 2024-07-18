import { prop, getModelForClass } from '@typegoose/typegoose';

class ProductManagement {

    @prop({ type: String, required: true })
    public ProductName!: string;

    @prop({ type: Object, required: true })
    public Type!: object;

    @prop({ type: String, required: false })
    public Group?: string;

    @prop({ type: String, required: false })
    public Season?: string;

    @prop({ type: String, required: false })
    public Priority?: string;

    @prop({ type: Number, required: false })
    public Roster?: number;

    @prop({ type: String, required: true })
    public VeggieNameInHindi!: string;

    @prop({ type: Number, required: true })
    public UnitQuantity!: number;

    @prop({ type: Number, required: false })
    public Pieces?: number;

    @prop({ type: String, required: true })
    public UpdatedAt!: string; 

    @prop({ type: String, required: true })
    public CreatedAt!: string;
}

const ProductManagementModel = getModelForClass(ProductManagement);

export default ProductManagementModel;
