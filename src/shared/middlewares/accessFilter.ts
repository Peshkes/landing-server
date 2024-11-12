import {NextFunction, RequestHandler, Response, Request} from "express";
import {Roles} from "../../modules/authentication/types";

export const superUserAccessFilter = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.user.superUser)
        return next();
    else
        return res.status(403).json("Доступ запрещен");
};

export const ownerAccessFilter: RequestHandler = async (req: Request, res:Response, next: NextFunction) => {
    if (res.locals.user.superUser) return next(); //account id
    const requestedId = req.path.split("/").pop();
    if (res.locals.user._id.toString() === requestedId) return next();
    return res.status(403).json("Доступ запрещен");
};

export const userGroupAccessFilter: RequestHandler = groupAccessFilterWrapper(Roles.USER);
export const moderatorGroupAccessFilter: RequestHandler = groupAccessFilterWrapper(Roles.MODERATOR);
export const adminGroupAccessFilter: RequestHandler = groupAccessFilterWrapper(Roles.ADMIN);

function groupAccessFilterWrapper(minRole: Roles): RequestHandler {
    return async (req, res, next: NextFunction) => {
        await groupAccessFilter(req, res, next, minRole);
    };
}

async function groupAccessFilter(req: Request, res: Response, next: NextFunction, minRole: Roles) {
    if (res.locals.user.superUser) return next(); // offer_id and group_id
    const groupId = req.path.split("/").pop();
    const group = res.locals.user.groups.get(groupId);
    if (group && group.role >= minRole)
        next();
    else
        return res.status(403).json("Доступ запрещен");
}