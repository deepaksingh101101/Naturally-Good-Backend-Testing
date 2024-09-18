import { prop, getModelForClass, pre, Ref } from '@typegoose/typegoose';
import { Admin } from './oldrole.model';
import { Employee } from './employee.model';
import { ProductType, Roster, Season } from './dropdown.model';

@pre<Product>('save', async function() {
  this.UpdatedAt = new Date();
})

export class Product {
  @prop({ type: String, required: true })
  public ProductName!: string;

  @prop({ ref: () => ProductType,required:true })
  public Type!: Ref<ProductType>;

  @prop({ ref: () => Season ,required:true})
  public Season!: Ref<Season>;

  @prop({ type: String, required: true })
  public Priority?: string;

  @prop({ ref: () => Roster })
  public Roster!: Ref<Roster>;

  @prop({ type: String, required: true })
  public Group?: string;

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
  public ImageURL!: string;

  @prop({ type: String, required: false })
  public Description?: string;

  @prop({ type: String, required: false })
  public Notes?: string;

  @prop({ type: Number,required:true })
  public Buffer?: number;

  @prop({ type: Boolean, required: false, default: true })
  public Available?: boolean;

  @prop({ type: String, enum: ['Admin', 'Public'], required: true, default: 'Admin' })
  public Visibility?: string;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

  @prop({ ref: () => Employee })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee })
  public UpdatedBy!: Ref<Employee>;

}

const ProductModel = getModelForClass(Product);

export default ProductModel;
