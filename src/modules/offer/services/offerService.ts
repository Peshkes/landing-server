import DraftOfferModel from "../models/draftOfferModel";
import PublicOfferModel from "../models/publicOfferModel";
import {DraftOffer, PublicOffer} from "../offerTypes";
import {ObjectId} from "mongoose";


const addNewOffer = async (offer: DraftOffer) => {
    try {
        const {name, body} = offer;
        const newOffer = new DraftOfferModel({
            name,
            body
        });
        await newOffer.save();
    } catch (error: any) {
        throw new Error(`Ошибка при создании коммерческого предложения: ${error.message}`);
    }
};


const getOfferById = async (id: string): Promise<DraftOffer> => {
    try {
        const offer: DraftOffer | null = await DraftOfferModel.findById(id);
        if (!offer) throw new Error("Коммерческого предложения с таким ID: " + id + " не найдено");
        return {name: offer.name, body: offer.body, _id: offer._id};
    } catch (error: any) {
        throw new Error(`Ошибка при получении аккаунта: ${error.message}`);
    }
};

const getAllOffers = async (): Promise<DraftOffer[]> => {
    try {
        const offers: DraftOffer[] = await DraftOfferModel.find();
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
        const offer: DraftOffer | null = await DraftOfferModel.findByIdAndDelete(id);
        if (!offer) throw new Error("Коммерческого предложения с таким ID: " + id + " не найдено");
        return {name: offer.name, body: offer.body, _id: offer._id};
    } catch (error: any) {
        throw new Error(`Ошибка при удалении коммерческих предложений: ${error.message}`);
    }
};

const updateOfferById = async (id: string | null, newOffer: DraftOffer) => {
    try {
        let offer: DraftOffer | null;
        if (id) {
            offer = await DraftOfferModel.findById(id);
            if (!offer)
                return await addNewOffer(newOffer);
        } else
            return await addNewOffer(newOffer);
        const {name, body} = newOffer;
        await DraftOfferModel.findByIdAndUpdate(id, {name, body});
    } catch (error: any) {
        throw new Error(`Ошибка при обновлении коммерчеого предложения: ${error.message}`);
    }
};

const publicateOffer = async (offerToPublicate: PublicOffer) => {
    try {
        const {name, body, _id: id = null} = offerToPublicate;
        if (id) {
            const draftOffer: DraftOffer | null = await DraftOfferModel.findById(id);
            if (!draftOffer) {
                const publicOffer: PublicOffer | null = await PublicOfferModel.findById(id);
                if (!publicOffer) throw new Error(`Ошибка при обновлении публикации предложения: некорректнвый ID ${id}`);
                await PublicOfferModel.findByIdAndUpdate(id, {name, body, update_date: new Date(Date.now())});
            } else {
                await saveOfferToPublicRepo(offerToPublicate);
            }
        } else {
            await saveOfferToPublicRepo(offerToPublicate);
        }
    } catch (error: any) {
        throw new Error(`Ошибка при публикации коммерчеого предложения: ${error.message}`);
    }
};

const saveOfferToPublicRepo = async (offerToPublicate: PublicOffer) => {
    const {name, body, _id: id = null, expiration_date} = offerToPublicate;
    const newPublicOffer = new PublicOfferModel({
        name, body, publication_date: new Date(Date.now()), expiration_date, id
    });
    await newPublicOffer.save();
    id && await DraftOfferModel.findByIdAndDelete(id);
};

// const moveOffersToGroup = async (offersToMove: PublicOffer[] | DraftOffer[], groupId: string) => {
//
// };


export {addNewOffer, getOfferById, getAllOffers, deleteOfferById, updateOfferById, publicateOffer};