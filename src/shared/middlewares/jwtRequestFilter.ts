import {Roles, User} from "../../modules/authentication/types";
import {verifyToken} from "../jwtService";
import {NextFunction, RequestHandler} from "express";
import {Request} from "express-serve-static-core";
import UserModel from "../../modules/authentication/models/userModel";

export const jwtUserRequestFilter: RequestHandler = async (req, res, next: NextFunction) => {
    await jwtRequestFilter(req, res, next, Roles.USER);
};

export const jwtAdminRequestFilter: RequestHandler = async (req, res, next: NextFunction) => {
    await jwtRequestFilter(req, res, next, Roles.ADMIN);
};

export const jwtModeratorRequestFilter: RequestHandler = async (req, res, next: NextFunction) => {
    await jwtRequestFilter(req, res, next, Roles.MODERATOR);
};

const jwtRequestFilter = async (req: Request, res: any, next: NextFunction, minRole: Roles) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) return res.status(401).json({message: "Отсутствует токен доступа"});
        const jwtDecoded = verifyToken(accessToken, false);
        const user = await UserModel.findById(jwtDecoded.userId).lean() as unknown as User;
        if (!user) return res.status(404).json({message: "Пользователь не найден"});
        const role = user.groups && user.groups.role; //TODO fix Roles
        if (user.superUser || (role && role >= minRole)) {
            res.locals.user = user;
            return next();
        } else
            return res.status(403).json({message: "Доступ запрещен"});
    } catch (error: any) {
        return res.status(500).json({message: `Ошибка при проверке доступа: ${error.message}`});
    }
};