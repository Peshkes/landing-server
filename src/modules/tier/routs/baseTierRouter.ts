import express from "express";
import {
    addNewBaseTier,
    deleteBaseTierById,
    getAllBaseTiers,
    getBaseTierById,
    updateBaseTierById
} from "../services/baseTierService";
import {doubleCsrfProtection} from "../../../shared/csrfConfig";
import {superUserAccessFilter} from "../../../shared/middlewares/accessFilter";


const baseTierRouter = express.Router();

baseTierRouter.post("", doubleCsrfProtection, superUserAccessFilter, async (req, res) => {
    const {name, settings} = req.body;
    try {
        const tiers = addNewBaseTier({name, settings});
        res.status(200).json({
            message: "Тир создан",
            tier: tiers
        });
    } catch (error: any) {
        res.status(400).json({message: "Ошибка при создании тира: " + error.message});
    }
});

baseTierRouter.get("", doubleCsrfProtection, superUserAccessFilter, async (_, res) => {
    try {
        const tiers = await getAllBaseTiers();
        res.status(200).json({
            message: "Список всех тиров получен",
            tiers: tiers
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

baseTierRouter.get("/:id", doubleCsrfProtection, superUserAccessFilter, async (req, res) => {
    const {id} = req.params;
    try {
        const tiers = await getBaseTierById(id);
        res.status(200).json({
            message: "Тир найден",
            tier: tiers
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

baseTierRouter.delete("/:id", doubleCsrfProtection, superUserAccessFilter, async (req, res) => {
    const {id} = req.params;
    try {
        const tier = await deleteBaseTierById(id);
        res.status(200).json({
            message: "Тир успешно удален",
            tier: tier
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

baseTierRouter.put("/:id", doubleCsrfProtection, superUserAccessFilter, async (req, res) => {
    const {id} = req.params;
    const newBaseTier = req.body;
    try {
        await updateBaseTierById(id, newBaseTier);
        res.status(200).json({
            message: "Тир успешно изменен"
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});


export default baseTierRouter;