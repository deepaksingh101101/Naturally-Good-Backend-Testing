import { getModelForClass, ModelOptions, prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Report {

    @prop({ type: String, required: true })
    public ReportType: string;

    @prop({ type: String, required: true })
    public Content: string;

    @prop({ type: String , required:true})
    public BufferNumber: string;

    @prop({ type: String, required: true })
    public UpdatedAt: string;

    @prop({ type: String, required: true })
    public CreatedAt: string;
}

const ReportModel = getModelForClass(Report);

export default ReportModel;
