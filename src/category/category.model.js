import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
    name : {
        type: String,
        required: [true, "The name is required"]
    },
    condition : {
        type: Boolean,
        default: true
    },
});

CategorySchema.methods.toJSON = function (){
    const { __v, _id, ...category_} = this.toObject();
    category_.uid = _id;
    return category_;
};

export default mongoose.model("Category", CategorySchema);