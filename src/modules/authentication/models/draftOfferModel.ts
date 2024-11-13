import mongoose from "mongoose";
import any = jasmine.any;

const Block = new mongoose.Schema({
    block: {
        type: any
    }
});

const draftOffer = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    body: {
        type: [Block],
        required: true
    }
});


const DraftOffer = mongoose.model("DraftOffer", draftOffer);

export default DraftOffer;


