import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "Role",
        required: true
    }
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;