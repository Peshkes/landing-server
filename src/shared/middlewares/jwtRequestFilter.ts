import {User} from "../../modules/authentication/types";
import {verifyToken} from "../jwtService";
import {NextFunction, Response, Request} from "express";
import UserModel from "../../modules/authentication/models/userModel";

export const jwtRequestFilter = async (req: Request, res: Response, next: NextFunction) => {
    if (checkFreeEndpoints(req.method, req.path)) return next();
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) return res.status(401).json({message: "Отсутствует токен доступа"});
        const jwtDecoded = verifyToken(accessToken, false);
        const user: User | null = await UserModel.findById(jwtDecoded.userId);
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
    const isCsrf: boolean = method === "GET" && url === "/auth/csrf";
    const isRegistration: boolean = method === "POST" && url === "/auth/registration";
    const isRefresh: boolean = method === "POST" && url === "/auth/refresh";
    const isSignIn: boolean = method === "POST" && url === "/auth/signin";
    return isCsrf || isRegistration || isRefresh || isSignIn;
};