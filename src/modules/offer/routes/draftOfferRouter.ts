import express from "express";
import {
    addNewOffer,
    deleteOfferById,
    getAllOffers,
    getOfferById,
    publicateOffer,
    updateOfferById
} from "../services/offerService";
import {doubleCsrfProtection} from "../../../shared/csrfConfig";
import {ownerAccessFilter, superUserAccessFilter} from "../../../shared/middlewares/accessFilter";



const draftOfferRouter = express.Router();

draftOfferRouter.post("", async (req, res) => {
    const {name, body} = req.body;
    try {
        const offer = addNewOffer({name, body});
        res.status(200).json({
            message: "Коммерческое предложение создано",
            offer: offer
        });
    } catch (error: any) {
        res.status(400).json({message: "Ошибка при создании коммерческого предложения: " + error.message});
    }
});


draftOfferRouter.get("", doubleCsrfProtection, superUserAccessFilter, async (_, res) => {
    try {
        const offers = await getAllOffers();
        res.status(200).json({
            message: "Список всех коммерческих предложений получен",
            offers: offers
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

draftOfferRouter.get("/:id", doubleCsrfProtection, ownerAccessFilter, async (req, res) => {
    const {id} = req.params;
    try {
        const offer = await getOfferById(id);
        res.status(200).json({
            message: "Коммерческое предложение найдео",
            offer: offer
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

draftOfferRouter.delete("/:id", doubleCsrfProtection, ownerAccessFilter, async (req, res) => {
    const {id} = req.params;
    try {
        const account = await deleteOfferById(id);
        res.status(200).json({
            message: "Коммерческое предложение успешно удалено",
            offer: account
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

draftOfferRouter.put("/:id", doubleCsrfProtection, ownerAccessFilter, async (req, res) => {
    const {id} = req.params;
    const newOffer = req.body;
    try {
        await updateOfferById(id, newOffer);
        res.status(200).json({
            message: "Коммерческое предложение успешно изменено"
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

draftOfferRouter.post("/:id/:expiration_date", async (req, res) => {
    const {id, expiration_date} = req.params;

    try {
        const offer = publicateOffer(id,new Date(expiration_date));
        res.status(200).json({
            message: "Коммерческое предложение создано",
            offer: offer
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

export default draftOfferRouter;