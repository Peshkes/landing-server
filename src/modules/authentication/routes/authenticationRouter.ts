import express from "express";
import {refreshToken, signIn} from "../services/authenticationJWTService";
import {
    changePassword,
    deleteAccountById,
    getAccountByEmailOrId,
    getAllAccounts,
    registrateUser
} from "../services/authenticationService";
import {ACCESS_EXPIRATION_TIME, REFRESH_EXPIRATION_TIME} from "../../../shared/jwtService";
import {checkOwnerFilter, jwtAdminRequestFilter, jwtUserRequestFilter} from "../services/JwtRequestFilter";
import {doubleCsrfProtection, generateToken} from "../../../shared/csrfConfig";



const authenticationRouter = express.Router();


authenticationRouter.get("/csrf", async (req, res) => {
    try {
        const csrfToken = generateToken(req, res);
        res.json({csrfToken});
    } catch (error:any) {
        res.status(400).json({ message: "Ошибка при генерации CSRF токена: " + error.message });
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
        res.status(201)
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

authenticationRouter.post("/refresh", jwtUserRequestFilter, doubleCsrfProtection, async (req, res) => {

    const token: string = req.cookies.refreshToken;
    try {
        const response = await refreshToken(token);
        res.status(201)
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

authenticationRouter.post("/logout", jwtUserRequestFilter, doubleCsrfProtection, async (req, res) => {
    try {
        res.status(201).clearCookie("accessToken").clearCookie("refreshToken").json({
            message: "Пользователь вышел из аккаунта"
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

authenticationRouter.get("/allusers", jwtUserRequestFilter, async (req, res) => {
    try {
        const accounts = await getAllAccounts();
        res.status(201).json({
            message: "Список всех пользователей получен",
            accounts: accounts
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

authenticationRouter.get("/:obj", jwtAdminRequestFilter, async (req, res) => {
    const {obj} = req.params;
    try {
        const account = await getAccountByEmailOrId(obj);
        res.status(201).json({
            message: "Пользователь найден",
            accounts: account
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

authenticationRouter.delete("/:id",  jwtAdminRequestFilter,checkOwnerFilter,doubleCsrfProtection, async (req, res) => {
    const {id} = req.params;
    try {
        //   const objectId = new mongoose.Schema.Types.ObjectId(id);
        const account = await deleteAccountById(id);
        res.status(200).json({
            message: "Пользователь успешно удален",
            accounts: account
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});

authenticationRouter.put("/:id", jwtUserRequestFilter, checkOwnerFilter, doubleCsrfProtection, async (req, res) => {
    const {id} = req.params;
    const {newPassword} = req.body;
    try {
        await changePassword(id, newPassword);
        res.status(201).json({
            message: "Пароль изменен"
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
});


export default authenticationRouter;