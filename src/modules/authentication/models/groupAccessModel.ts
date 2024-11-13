import mongoose from "mongoose";
import {Roles} from "../types";

const groupAccessSubSchema = new mongoose.Schema({
    account_id: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: Roles,
        required: true
    }
});

const groupAccessSchema = new mongoose.Schema({
    groups: {
        type: Map,
        of: [groupAccessSubSchema],
        required: false
    }
},
{_id: false}
);

const GroupAccessSchema = mongoose.model("GroupAccessSchema", groupAccessSchema);

export default GroupAccessSchema;


