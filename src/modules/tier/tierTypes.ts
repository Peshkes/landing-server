import {ObjectId} from "mongoose";

export type BaseTier = {
    _id?: ObjectId;
    name: string;
    settings: string;
}

export type SalesTier = {
    _id?: ObjectId;
    name: string;
    duration: number;
    price: number;
    base_tier: string;
    sales_price?: number;
    expiration_date?: Date;
}