import {NextFunction, RequestHandler} from "express";

export const checkOwnerFilter: RequestHandler = async (req, res, next: NextFunction) => {
    if (!res.locals.user) return res.status(403).json("Пользователь не найден");
    if (res.locals.user.superUser) return next();
    if (res.locals.user._id.toString() === req.path.split("/")[req.path.split("/").length - 1]) return next();
    return res.status(403).json("Доступ запрещен");
};