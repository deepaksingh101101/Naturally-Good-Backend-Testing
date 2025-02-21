import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Task {
  @prop({ type: String, required: true })
  public Title: string;

  @prop({ type: String, required: true })
  public Description: string;
}

const TaskModel = getModelForClass(Task);

export default TaskModel;
 