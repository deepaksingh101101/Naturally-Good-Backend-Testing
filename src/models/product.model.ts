import { prop, getModelForClass, pre, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Admin } from './role.model';

@pre<Product>('save', function() {
  this.UpdatedAt = new Date();
})
class Product {

    @prop({ type: String, required: true })
    public ProductName!: string;

    @prop({ type: String, required: true })
    public Type!: string;

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

    // @prop({ type: Number, required: false })
    // public Pieces?: number;

    @prop({ type: Number, required: true })
    public Price!: number;

    @prop({ type: Number, required: true })
    public MinimumUnits!: number;

    @prop({ type: Number, required: true })
    public MaximumUnits!: number;

    @prop({ type: String, required: false })
    public Group?: string;

    // @prop({ type: String, required: false })
    // public Category?: string;

    // @prop({ type: Number, required: true })
    // public Stock!: number;

    @prop({ type: String, required: false })
    public ImageURL?: string;

    @prop({ type: String, required: false })
    public Description?: string;

    // @prop({ type: String, required: false })
    // public NutritionalInfo?: string;

    @prop({ type: Boolean, required: false, default: false })
    public Organic?: boolean;

    @prop({ type: Boolean, required: false, default: true })
    public Available?: boolean;

    @prop({ type: Date, default: Date.now })
    public UpdatedAt!: Date;

    @prop({ type: Date, default: Date.now })
    public CreatedAt!: Date;

    @prop({ ref: () => Admin })
    public createdBy!: Ref<Admin>;
}

const ProductModel = getModelForClass(Product);

export default ProductModel;
