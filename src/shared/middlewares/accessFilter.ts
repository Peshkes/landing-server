import {NextFunction, RequestHandler, Response, Request} from "express";
import {Roles} from "../../modules/authentication/types";
import GroupAccessModel from "../../modules/group/models/groupAccessModel";

export const superUserAccessFilter = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.user.superUser)
        return next();
    else
        return res.status(403).json("Доступ запрещен");
};

export const ownerAccessFilter: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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
    if (groupId)  {
        const role = await getClientRole(res.locals.user._id, groupId);
        if (role && role >= minRole)
            next();
        else 
            return res.status(403).json("Доступ запрещен");
    }else
        return res.status(403).json("Доступ запрещен");
}

const getClientRole = async (accountId: string, groupId: string) => {
    try {
        const groupAccess = await GroupAccessModel.findOne({
            [`groups.${groupId}.account_id`]: accountId
        }, {
            [`groups.${groupId}.$`]: 1
        });

        if (groupAccess && groupAccess.groups) {
            const group = groupAccess.groups.get(groupId);
            if (group && group[0]) {
                return group[0].role;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.error("Ошибка при получении роли:", error);
        return null;
    }
};