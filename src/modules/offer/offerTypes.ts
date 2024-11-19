import {ObjectId} from "mongoose";


export type DraftOffer = {
    name: string;
    body: any //TODO Change type
    _id?: ObjectId
}

export type PublicOffer = DraftOffer & {
    publication_date: Date;
    expiration_date: Date
    update_date?: Date
}

