import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    superUser: {
        type: Boolean,
        required: false
    },
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
    lastPasswords: {
        type: [String],
        required: true
    },
    subscription: {
        type: String || null,
        required: false,
        ref: "Subscription"
    },
    publicOffers: {
        type: [String],
        required: true
    },
    draftOffers: {
        type: [String],
        required: true
    }
});


const UserModel = mongoose.model("User", userSchema);

export default UserModel;