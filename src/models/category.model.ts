import { prop, getModelForClass, Ref } from '@typegoose/typegoose';

// Enum for CategoryType
export enum CategoryType {
    Marrow = 'Marrow',
    EdiblePlantStem = 'Edible plant stem',
    Allium = 'Allium'
}
class Category {
    @prop({ type: String, enum: CategoryType, required: false })
    public Type?: CategoryType;

    @prop({ type: String, required: true })
    public Name!: string;

    @prop({ type: String, required: false })
    public Description?: string;

    @prop({ type:Object, default: [] }) 
    public Children?: [];

    @prop({ type: String, required: true })
    public createdBy!: string;

    @prop({ default: () => new Date() })
    public UpdatedAt!: Date;

    @prop({ default: () => new Date() })
    public CreatedAt!: Date;
}

const CategoryModel = getModelForClass(Category);

export default CategoryModel;
