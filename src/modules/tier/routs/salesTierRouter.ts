import express from "express";

import {doubleCsrfProtection} from "../../../shared/csrfConfig";
import { superUserAccessFilter} from "../../../shared/middlewares/accessFilter";
import {
    addNewSalesTier,
    deleteSalesTierById,
    getAllSalesTiers,
    getSalesTierById,
    updateSalesTierById
} from "../services/salesTierService";

const salesTierRouter = express.Router();

salesTierRouter.post("", doubleCsrfProtection, superUserAccessFilter, async (req, res) => {
    const {name, duration, price, base_tier, sales_price, expiration_date} = req.body;
    try {
        const tiers = addNewSalesTier({name, duration, price, base_tier, sales_price, expiration_date});
        res.status(200).json({
            message: "Тир создан",
            tier: tiers
        });
    } catch (error: any) {
        res.status(400).json({message: "Ошибка при создании тира: " + error.message});
    }
});

salesTierRouter.get("", doubleCsrfProtection, superUserAccessFilter, async (_, res) => {
    try {
        const tiers = await getAllSalesTiers();
        res.status(200).json({
            message: "Список всех тиров получен",
            tiers: tiers
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

salesTierRouter.get("/:id", doubleCsrfProtection, superUserAccessFilter, async (req, res) => {
    const {id} = req.params;
    try {
        const tiers = await getSalesTierById(id);
        res.status(200).json({
            message: "Тир найден",
            tier: tiers
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

salesTierRouter.delete("/:id", doubleCsrfProtection, superUserAccessFilter, async (req, res) => {
    const {id} = req.params;
    try {
        const tier = await deleteSalesTierById(id);
        res.status(200).json({
            message: "Тир успешно удален",
            tier: tier
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

salesTierRouter.put("/:id", doubleCsrfProtection, superUserAccessFilter, async (req, res) => {
    const {id} = req.params;
    const newSalesTier = req.body;
    try {
        await updateSalesTierById(id, newSalesTier);
        res.status(200).json({
            message: "Тир успешно изменен"
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});



export default salesTierRouter;