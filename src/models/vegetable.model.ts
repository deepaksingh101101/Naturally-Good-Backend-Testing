import { getModelForClass, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';

export enum Category {
  Cruciferous = 'Cruciferous',
  Allium = 'allium',
}

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Vegetable {
  @prop({ type: Number, required: true })
  public unit: number;

  @prop({ type: String, required: true })
  public vegetableName: string;

  @prop({ type: String, enum: Category, required: false })
  public vegetableCategory?: Category;

  @prop({ type: Number, required: true })
  public quantity: number;

  @prop({ type: String })
  public description?: string;

  @prop({ type: String, required: true })
  public pricePerUnit: string;

  @prop({ type: Boolean, required: true })
  public availability: boolean;

  @prop({ type: String })
  public qualityGrade?: string;

  @prop({ type: Boolean })
  public organicStatus?: boolean;

  @prop({ type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true })
  public adminId: Ref<mongoose.Schema.Types.ObjectId>;
}

const VegetableModel = getModelForClass(Vegetable);

export default VegetableModel;
