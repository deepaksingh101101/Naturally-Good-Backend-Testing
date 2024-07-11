import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Report {

    @prop({ type: String, required: true })
    public ReportId: string;

    @prop({ type: String, required: true })
    public reportType: string;

    @prop({ type: String, required: true })
    public content: string;

    @prop({ type: String , required:true})
    public bufferNumber: string;

    @prop({ type: String, required: true })
    public updatedAt: string;

    @prop({ type: String, required: true })
    public createdAt: string;
}

const ReportModel = getModelForClass(Report);

export default ReportModel;
