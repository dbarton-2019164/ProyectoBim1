import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "The name is required"]
    },
    user:{
        type: String,
        required: [true, "The name is required"]
    },
    email: {
        type: String,
        required: [true, "The email is required"]
    },
    password: {
        type: String,
        required: [true, "The password is required"]
    },
    role: {
        type: String,
        default: "CLIENT_ROLE"
    },
    condition: {
        type: Boolean,
        default: true
    },
});

UserSchema.methods.toJSON = function (){
    const { __v, password, _id, ...userD} = this.toObject();
    userD.uid = _id;
    return userD;
};

export default mongoose.model('User', UserSchema);