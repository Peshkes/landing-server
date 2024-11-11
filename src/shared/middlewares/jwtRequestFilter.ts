import {User} from "../../modules/authentication/types";
import {verifyToken} from "../jwtService";
import {NextFunction} from "express";
import {Request} from "express-serve-static-core";
import UserModel from "../../modules/authentication/models/userModel";

export const jwtRequestFilter = async (req: Request, res: any, next: NextFunction) => {
    if (checkFreeEndpoints(req.method, req.path)) return next();
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) return res.status(401).json({message: "Отсутствует токен доступа"});
        const jwtDecoded = verifyToken(accessToken, false);
        const user = await UserModel.findById(jwtDecoded.userId).lean() as unknown as User;
        if (!user)
            return res.status(404).json({message: "Пользователь не найден"});
        else {
            res.locals.user = user;
            next();
        }
    } catch (error: any) {
        return res.status(500).json({message: `Ошибка при проверке доступа: ${error.message}`});
    }
};

const checkFreeEndpoints = (method: string, url: string): boolean => {
    const isCsrf: boolean = method === "GET" && url === "/csrf";
    const isRegistration: boolean = method === "POST" && url === "/registration";
    const isRefresh: boolean = method === "POST" && url === "/refresh";
    const isSignIn: boolean = method === "POST" && url === "/signin";
    return isCsrf || isRegistration || isRefresh || isSignIn;
};