import {FilterResponse, Roles, User} from "../../modules/authentication/types";
import {verifyToken} from "../jwtService";
import {NextFunction, RequestHandler} from "express";
import {Request} from "express-serve-static-core";
import UserModel from "../../modules/authentication/models/userModel";

export const jwtUserRequestFilter: RequestHandler = async (req, res, next: NextFunction) => {
    const result = await jwtRequestFilter(req, Roles.USER);
    handleJwtRequestResult(result, res, next);
};

export const jwtAdminRequestFilter: RequestHandler = async (req, res, next: NextFunction) => {
    const result = await jwtRequestFilter(req, Roles.ADMIN);
    handleJwtRequestResult(result, res, next);
};

export const jwtModeratorRequestFilter: RequestHandler = async (req, res, next: NextFunction) => {
    const result = await jwtRequestFilter(req, Roles.MODERATOR);
    handleJwtRequestResult(result, res, next);
};

const jwtRequestFilter = async (req: Request, minRole: Roles): Promise<FilterResponse> => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) return {message: "Отсутствует токен доступа", code: 401};
        const jwtDecoded = verifyToken(accessToken, false);
        const user = await UserModel.findById(jwtDecoded.userId).lean() as unknown as User;
        if (!user) return {message: "Пользователь не найден", code: 404};
        if (user.superUser && !user.groups) return user;
        const role = user.groups && user.groups.role;
        if (role && role >= minRole)
            return user;
        else
            return {message: "Доступ запрещен", code: 403};
    } catch (error: any) {
        return {message: `Ошибка при проверке доступа: ${error.message}`, code: 500};
    }
};

const handleJwtRequestResult = (result: FilterResponse, res: any, next: NextFunction) => {
    if ("name" in result && "email" in result) {
        res.locals.user = result;
        return next();
    }
    return res.status(result.code).json({ message: result.message });
};