
import DraftOfferModel from "../models/draftOfferModel";
import PublicOfferModel from "../models/publicOfferModel";
import {DraftOffer, PublicOffer} from "../offerTypes";



const addNewOffer = async (offer: DraftOffer) => {
    try {
        const {name, body} = offer;
        const newOffer = new DraftOfferModel({
            name,
            body
        });
        await newOffer.save();
    } catch (error:any) {
        throw new Error(`Ошибка при создании коммерческого предложения: ${error.message}`);
    }
};


const getOfferById = async (id: string): Promise<DraftOffer> => {
    try {
        const offer:DraftOffer | null = await DraftOfferModel.findById(id);
        if (!offer) throw new Error("Коммерческого предложения с таким ID: " + id + " не найдено");
        return {name: offer.name, body: offer.body, _id: offer._id};
    } catch (error: any) {
        throw new Error(`Ошибка при получении аккаунта: ${error.message}`);
    }
};

const getAllOffers = async (): Promise<DraftOffer[]> => {
    try {
        const offers:DraftOffer[] = await DraftOfferModel.find();
        return offers.map(offer => ({
            name: offer.name,
            body: offer.body
        }));
    } catch (error: any) {
        throw new Error(`Ошибка при получении списка коммерческих предложений: ${error.message}`);
    }
};

const deleteOfferById = async (id: string): Promise<DraftOffer> => {
    try {
        const offer:DraftOffer | null = await DraftOfferModel.findByIdAndDelete(id);
        if (!offer) throw new Error("Коммерческого предложения с таким ID: " + id + " не найдено");
        return {name: offer.name, body: offer.body, _id: offer._id};
    } catch (error: any) {
        throw new Error(`Ошибка при удалении коммерческих предложений: ${error.message}`);
    }
};

const updateOfferById = async (id: string, newOffer: DraftOffer) => {
    try {
        const offer:DraftOffer | null = await DraftOfferModel.findById(id);
        if (!offer) throw new Error("Коммерческого предложения с таким ID: " + id + " не найдено");
        const {name, body} = newOffer;
        await DraftOfferModel.updateOne({name, body});
    } catch (error: any) {
        throw new Error(`Ошибка при обновлении коммерчеого предложения: ${error.message}`);
    }
};

const publicateOffer = async (id: string, expirationDate?:Date):Promise<PublicOffer> => {
    try {
        const offer:DraftOffer | null = await DraftOfferModel.findById(id);
        if (!offer) throw new Error("Коммерческого предложения с таким ID: " + id + " не найдено");
        const {name, body, _id} = offer;
        const newPublicOffer = new PublicOfferModel({
            name,
            body,
            _id,
            publication_date: new Date(Date.now()),
            expiration_date: expirationDate?expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) //30 days
        });
        await newPublicOffer.save();
        await deleteOfferById(id);
        return {name: newPublicOffer.name, body: newPublicOffer.body, _id: _id, publication_date: newPublicOffer.publication_date, expiration_date: newPublicOffer.publication_date};
    } catch (error: any) {
        throw new Error(`Ошибка при обновлении коммерчеого предложения: ${error.message}`);
    }
};

export {addNewOffer,getOfferById, getAllOffers, deleteOfferById, updateOfferById, publicateOffer};