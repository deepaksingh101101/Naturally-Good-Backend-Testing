import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

class Item {
  @prop({ required: true })
  public VegetableName!: string;

  @prop({ required: true })
  public Quantity!: number;

  @prop({ required: true })
  public Price!: number;
}

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Bag {

  @prop({ type: String, required: true })
  public UserId: string;

  @prop({ type: () => [Item], required: true })
  public VegetablesItems!: Item[];

  @prop({ type: Number, required: true })
  public TotalAmount: number;

}

const BagModel = getModelForClass(Bag);

export default BagModel;
