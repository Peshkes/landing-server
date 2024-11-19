import express from "express";
import {
    addNewOffer, deleteDraftOfferById,
    deletePublicOfferById, getAllDraftOffers,
    getAllPublicOffers,
    getOfferById,
    publicateOffer,
    updateOfferById
} from "../services/offerService";
import {doubleCsrfProtection} from "../../../shared/csrfConfig";
import {ownerAccessFilter, superUserAccessFilter} from "../../../shared/middlewares/accessFilter";


const offerRouter = express.Router();

offerRouter.post("", async (req, res) => {
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


offerRouter.get("/all_draft", doubleCsrfProtection, superUserAccessFilter, async (_, res) => {
    try {
        const offers = await getAllDraftOffers();
        res.status(200).json({
            message: "Список всех коммерческих предложений получен",
            offers: offers
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

offerRouter.get("/all_public", doubleCsrfProtection, superUserAccessFilter, async (_, res) => {
    try {
        const offers = await getAllPublicOffers();
        res.status(200).json({
            message: "Список всех коммерческих предложений получен",
            offers: offers
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

offerRouter.get("/:id", doubleCsrfProtection, ownerAccessFilter, async (req, res) => {
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

offerRouter.delete("/public/:id", doubleCsrfProtection, ownerAccessFilter, async (req, res) => {
    const {id} = req.params;
    try {
        const account = await deletePublicOfferById(id);
        res.status(200).json({
            message: "Коммерческое предложение успешно удалено",
            offer: account
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

offerRouter.delete("/draft/:id", doubleCsrfProtection, ownerAccessFilter, async (req, res) => {
    const {id} = req.params;
    try {
        const account = await deleteDraftOfferById(id);
        res.status(200).json({
            message: "Коммерческое предложение успешно удалено",
            offer: account
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

offerRouter.put("", doubleCsrfProtection, ownerAccessFilter, async (req, res) => {
    try {
        await updateOfferById(req.body);
        res.status(200).json({
            message: "Коммерческое предложение успешно изменено"
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

offerRouter.post("/publicate", async (req, res) => {
    try {
        const offer = publicateOffer(req.body);
        res.status(200).json({
            message: "Коммерческое предложение опубликовано",
            offer: offer
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});


export default offerRouter;