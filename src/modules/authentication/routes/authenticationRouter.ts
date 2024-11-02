import express from "express";
import {registrateUser} from "../services/authenticationService";

const authenticationRouter = express.Router();

authenticationRouter.post("/registration", async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const newUser = await registrateUser({name, email, password});
        res.status(201).json({
            message: "Пользователь успешно создан",
            user: newUser
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

export default authenticationRouter;
