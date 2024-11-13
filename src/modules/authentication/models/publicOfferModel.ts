import mongoose from "mongoose";
import any = jasmine.any;


const Block = new mongoose.Schema({
    block: {
        type: any
    }
});

const publicOffer = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    body: {
        type: [Block],
        required: true
    },
    publication_date: {
        type: Date,
        required: true
    },
    expiration_date: {
        type: Date,
        required: true
    }
});


const PublicOffer = mongoose.model("PublicOffer", publicOffer);

export default PublicOffer;


