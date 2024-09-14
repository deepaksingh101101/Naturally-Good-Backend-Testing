import { getModelForClass, ModelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { Product } from './product.model'; // Adjust the import path accordingly
import { Employee } from './employee.model';

@pre<Bag>('save', async function() {
  this.UpdatedAt = new Date();
})

export class Bag {
  @prop({ required: true })
  public BagName!: string;

  @prop({ required: true })
  public BagMaxWeight!: number;

  @prop({ type: String, enum: ['Admin', 'Public'],default:"Admin", required: true })
  public BagVisibility!: string;

  @prop({ type: Boolean, default: true })
  public Status!: boolean;

  @prop({ type: String, required: false})
  public BagImageUrl?: string;

  @prop({ type: String,required: false })
  public BagDescription?: string;

  @prop({ ref: () => Product, required: true })
  public AllowedItems!: Ref<Product>[];

  @prop({ ref: () => Employee })
  public CreatedBy!: Ref<Employee>;

  @prop({ ref: () => Employee })
  public UpdatedBy!: Ref<Employee>;

  @prop({ type: Date, default: Date.now })
  public UpdatedAt!: Date;

  @prop({ type: Date, default: Date.now })
  public CreatedAt!: Date;

}

export const BagModel = getModelForClass(Bag); // Ensure named export
