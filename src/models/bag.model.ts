import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { Product } from './product.model'; // Adjust the import path accordingly

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Bag {
  @prop({ required: true })
  public bagName!: string;

  @prop({ required: true })
  public bagMaxWeight!: number;

  @prop({ type: String, enum: ['Admin', 'Public'], required: true })
  public bagVisibility!: string;

  @prop({ type: String, enum: ['Active', 'Inactive'], required: true, default: 'Active' })
  public status!: string;

  @prop({ type: String })
  public bagImageUrl?: string;

  @prop({ type: String })
  public bagDescription?: string;

  @prop({ ref: () => Product, required: true })
  public allowedItems!: Ref<Product>[];

  @prop({ required: true })
  public CreatedBy!: string;

}

export const BagModel = getModelForClass(Bag); // Ensure named export
