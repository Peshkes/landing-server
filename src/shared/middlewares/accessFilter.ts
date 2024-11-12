import {NextFunction, RequestHandler} from "express";
import {Roles} from "../../modules/authentication/types";

export const accountAccessFilter: RequestHandler = async (req, res, next: NextFunction) => {
    checkBasicAccess(res, next);
    const requestedId = req.path.split("/").pop();
    if (res.locals.user._id.toString() === requestedId) return next();
    return res.status(403).json("Доступ запрещен");
};

export const ownOffersAccessFilter: RequestHandler = async (req, res, next: NextFunction) => {
    checkBasicAccess(res, next);
    const requestedId = req.path.split("/").pop();
    let userHasIt = res.locals.user.draftOffers.some((item: any) => item._id === requestedId);
    if (!userHasIt) userHasIt = res.locals.user.publicOffers.some((item: any) => item._id === requestedId);
    if (userHasIt) return next();
    return res.status(403).json("Доступ запрещен");
};

export const userGroupAccessFilter: RequestHandler = groupAccessFilterWrapper(Roles.USER);
export const moderatorGroupAccessFilter: RequestHandler = groupAccessFilterWrapper(Roles.MODERATOR);
export const adminGroupAccessFilter: RequestHandler = groupAccessFilterWrapper(Roles.ADMIN);

function groupAccessFilterWrapper (minRole: Roles): RequestHandler {
    return async (req, res, next: NextFunction) => {
        await groupAccessFilter(req, res, next, minRole);
    };
}

async function groupAccessFilter(req: any, res: any, next: NextFunction, minRole: Roles) {
    checkBasicAccess(res, next);
    const requestedId = req.path.split("/").pop();
    const group = res.locals.user.groups.find((item: any) => item.groupId === requestedId);
    if (group && group.role >= minRole) next();
    return res.status(403).json("Доступ запрещен");
}

function checkBasicAccess(res: any, next: NextFunction): void {
    if (!res.locals.user) res.status(403).json("Пользователь не найден");
    if (res.locals.user.superUser) return next();
}