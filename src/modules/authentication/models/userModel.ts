import mongoose from "mongoose";
import {Roles} from "../types";


const groupAccessSubSchema = new mongoose.Schema({
    groupId: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: Roles,
        required: true
    }
});

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
    groups: {
        type: groupAccessSubSchema,
        required: false
    },
    subscription: {
        type: String || null,
        required: false
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