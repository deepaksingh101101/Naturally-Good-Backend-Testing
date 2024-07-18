import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Category {
  @prop({ type: String, required: true })
  public Name: string;

  @prop({ type: String, required: true })
  public Description: string;
}

const CategoryModel = getModelForClass(Category);

export default CategoryModel;
