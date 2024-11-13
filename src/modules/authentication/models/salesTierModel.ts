import mongoose from "mongoose";

const salesTierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    base_tier: {
        type: String,
        required: true,
        ref: "BaseTier"
    },
    sale_amount: {
        type: Number,
        required: false
    },
    expiration_date: {
        type: Date,
        required: false
    }
});

const SalesTierModel = mongoose.model("SalesTier", salesTierSchema);

export default SalesTierModel;