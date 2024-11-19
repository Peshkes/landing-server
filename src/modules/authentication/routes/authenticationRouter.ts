import express from "express";
import {refreshToken, signIn} from "../services/authenticationJWTService";
import {registrateUser} from "../services/authenticationService";
import {ACCESS_EXPIRATION_TIME, REFRESH_EXPIRATION_TIME} from "../../../shared/jwtService";
import {doubleCsrfProtection, generateToken} from "../../../shared/csrfConfig";


const authenticationRouter = express.Router();

authenticationRouter.get("/csrf", async (req, res) => {
    try {
        const csrfToken = generateToken(req, res, true);
        res.json({csrfToken});
    } catch (error: any) {
        res.status(400).json({message: "Ошибка при генерации CSRF токена: " + error.message});
    }
});

authenticationRouter.post("/registration", doubleCsrfProtection, async (req, res) => {
    const {name, email, password} = req.body;
    try {
        await registrateUser({name, email, password});
        res.status(201).json({
            message: "Пользователь успешно создан и зарегистрирован"
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

authenticationRouter.post("/signin", doubleCsrfProtection, async (req, res) => {
    const {email, password} = req.body;
    try {
        const response = await signIn({email, password});
        res.status(200)
            .cookie("accessToken", response.accessToken, {
                expires: new Date(Date.now() + ACCESS_EXPIRATION_TIME * 1000),
                httpOnly: true
            })
            .cookie("refreshToken", response.refreshToken, {
                expires: new Date(Date.now() + REFRESH_EXPIRATION_TIME * 1000),
                httpOnly: true
            })
            .json({
                message: "Пользователь авторизован"
            });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

authenticationRouter.post("/refresh", doubleCsrfProtection, async (req, res) => {

    const token: string = req.cookies.refreshToken;
    try {
        const response = await refreshToken(token);
        res.status(200)
            .cookie("accessToken", response.accessToken, {
                expires: new Date(Date.now() + ACCESS_EXPIRATION_TIME * 1000),
                httpOnly: true
            })
            .cookie("refreshToken", response.refreshToken, {
                expires: new Date(Date.now() + REFRESH_EXPIRATION_TIME * 1000),
                httpOnly: true
            })
            .json({
                message: "Токен успешно обновлен"
            });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

authenticationRouter.post("/logout", doubleCsrfProtection, async (_, res) => {
    try {
        res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({
            message: "Пользователь вышел из аккаунта"
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

export default authenticationRouter;