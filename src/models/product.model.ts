import { prop, getModelForClass, pre, Ref } from '@typegoose/typegoose';
import { Admin } from './role.model';

@pre<Product>('save', async function() {
  this.updatedAt = new Date();
})

export class Product {
  @prop({ type: String, required: true })
  public ProductName!: string;

  @prop({ type: String, required: true })
  public Type!: string;

  @prop({ type: String, required: false })
  public Season?: string;

  @prop({ type: String, required: false })
  public Priority?: string;

  @prop({ type: String, required: false })
  public Roster?: string;

  @prop({ type: String, required: true })
  public VeggieNameInHindi!: string;

  @prop({ type: Number, required: true })
  public UnitQuantity!: number;

  @prop({ type: Number, required: true })
  public Price!: number;

  @prop({ type: Number, required: true })
  public MinimumUnits!: number;

  @prop({ type: Number, required: true })
  public MaximumUnits!: number;

  @prop({ type: String, required: false })
  public Group?: string;

  @prop({ type: String, required: true })
  public ImageURL!: string;

  @prop({ type: String, required: false })
  public Description?: string;

  @prop({ type: Boolean, required: false, default: true })
  public Available?: boolean;

  @prop({ type: String, enum: ['Admin', 'Public'], required: false, default: 'Admin' })
  public Visibility?: string;

  @prop({ type: Date, default: Date.now })
  public updatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;

  @prop({ ref: () => Admin })
  public createdBy!: Ref<Admin>;

  // Additional properties (uncomment if needed)
  // @prop({ type: String, required: false })
  // public NutritionalInfo?: string;

  // @prop({ type: Boolean, required: false, default: false })
  // public Organic?: boolean;

  // @prop({ type: String, required: false })
  // public Category?: string;

  // @prop({ type: Number, required: true })
  // public Stock!: number;
}

const ProductModel = getModelForClass(Product);

export default ProductModel;
