import mongoose from "mongoose";



const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    public_offers: {
        type: [String],
        required: true
    },
    draft_offers: {
        type: [String],
        required: true
    }
});

const GroupSchema = mongoose.model("GroupSchema", groupSchema);

export default GroupSchema;


