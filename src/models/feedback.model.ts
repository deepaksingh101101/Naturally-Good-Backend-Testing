import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
class Feedback {
  @prop({ required: true })
  public CreatedBy!: string;

  @prop({ required: true })
  public Feedback!: string;
  
}

const FeedbackModel = getModelForClass(Feedback);

export default FeedbackModel;
