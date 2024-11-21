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

const getAllDraftOffers = async (): Promise<DraftOffer[]> => {
    try {
        return await DraftOfferModel.find();
    } catch (error: any) {
        throw new Error(`Ошибка при получении списка коммерческих предложений: ${error.message}`);
    }
};

const getAllPublicOffers = async (): Promise<PublicOffer[]> => {
    try {
        return await PublicOfferModel.find();
    } catch (error: any) {
        throw new Error(`Ошибка при получении списка коммерческих предложений: ${error.message}`);
    }
};

const deletePublicOfferById = async (id: string): Promise<PublicOffer> => {
    try {
        const offer: PublicOffer | null = await PublicOfferModel.findByIdAndDelete(id);
        if (!offer) throw new Error("Коммерческого предложения с таким ID: " + id + " не найдено");
        return offer;
    } catch (error: any) {
        throw new Error(`Ошибка при удалении коммерческих предложений: ${error.message}`);
    }
};

const deleteDraftOfferById = async (id: string): Promise<DraftOffer> => {
    try {
        const offer: DraftOffer | null = await DraftOfferModel.findByIdAndDelete(id);
        if (!offer) throw new Error("Коммерческого предложения с таким ID: " + id + " не найдено");
        return offer;
    } catch (error: any) {
        throw new Error(`Ошибка при удалении коммерческих предложений: ${error.message}`);
    }
};

const updateOfferById = async (newOffer: DraftOffer) => {
    try {
        const {name, body, _id = null} = newOffer;
        if (!_id || !await DraftOfferModel.findByIdAndUpdate(_id, {name, body})) {
            return await addNewOffer(newOffer);
        }
    } catch (error: any) {
        throw new Error(`Ошибка при обновлении коммерчеого предложения: ${error.message}`);
    }
};


const publicateOffer = async (offerToPublicate: PublicOffer) => {
    try {
        const {name, body, _id = null} = offerToPublicate;
        if (!_id || await DraftOfferModel.findByIdAndDelete(_id)) {
            return await saveOfferToPublicRepo(offerToPublicate);
        }
        if (_id && !await PublicOfferModel.findByIdAndUpdate(_id, {name, body, update_date: new Date(Date.now())}))
            throw new Error(`Ошибка при обновлении публикации предложения: некорректнвый ID ${_id}`);
    } catch (error: any) {
        throw new Error(`Ошибка при публикации коммерчеого предложения: ${error.message}`);
    }
};

const saveOfferToPublicRepo = async (offerToPublicate: PublicOffer) => {
    const {name, body, _id, expiration_date} = offerToPublicate;
    const newPublicOffer = new PublicOfferModel({
        name, body, publication_date: new Date(Date.now()), expiration_date, _id
    });
    await newPublicOffer.save();
};


export {
    addNewOffer,
    getOfferById,
    getAllDraftOffers,
    getAllPublicOffers,
    deletePublicOfferById,
    deleteDraftOfferById,
    updateOfferById,
    publicateOffer
};