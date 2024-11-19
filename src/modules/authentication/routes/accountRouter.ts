import express from "express";
import {
    changePassword,
    copyOffersToGroup,
    deleteAccountById,
    deleterArrayOfOffers,
    getAccountByEmailOrId,
    getAllAccounts
} from "../services/authenticationService";
import {doubleCsrfProtection} from "../../../shared/csrfConfig";
import {ownerAccessFilter, superUserAccessFilter} from "../../../shared/middlewares/accessFilter";
import {MoveOffersRequest} from "../types";

const accountRouter = express.Router();


accountRouter.get("/allusers", doubleCsrfProtection, superUserAccessFilter, async (_, res) => {
    try {
        const accounts = await getAllAccounts();
        res.status(200).json({
            message: "Список всех пользователей получен",
            accounts: accounts
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

accountRouter.get("/:obj", doubleCsrfProtection, ownerAccessFilter, async (req, res) => {
    const {obj} = req.params;
    try {
        const account = await getAccountByEmailOrId(obj);
        res.status(200).json({
            message: "Пользователь найден",
            accounts: account
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

accountRouter.delete("/:id", doubleCsrfProtection, ownerAccessFilter, async (req, res) => {
    const {id} = req.params;
    try {
        const account = await deleteAccountById(id);
        res.status(200).json({
            message: "Пользователь успешно удален",
            accounts: account
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

accountRouter.put("/:id", doubleCsrfProtection, ownerAccessFilter, async (req, res) => {
    const {id} = req.params;
    const {newPassword} = req.body;
    try {
        await changePassword(id, newPassword);
        res.status(200).json({
            message: "Пароль изменен"
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

accountRouter.put("/copy/:group_id", async (req, res) => {
    const {group_id} = req.params;
    const {publicOffersToMove, draftOffersToMove} = req.body;
    try {
        await copyOffersToGroup(publicOffersToMove, draftOffersToMove, group_id);
        res.status(200).json({
            message: "Коммерческие предложения перенесын в группк" + group_id
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

accountRouter.put("/copy_and_delete/:group_id", async (req, res) => {
    const {group_id} = req.params;
    const {publicOffersToMove, draftOffersToMove} = req.body as MoveOffersRequest;
    try {
        await copyOffersToGroup(publicOffersToMove, draftOffersToMove, group_id);
        await deleterArrayOfOffers(publicOffersToMove, true);
        await deleterArrayOfOffers(draftOffersToMove, false);
        res.status(200).json({
            message: "Коммерческие предложения перенесын в группк" + group_id
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

export default accountRouter;