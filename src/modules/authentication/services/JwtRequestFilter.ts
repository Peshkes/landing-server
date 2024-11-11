import {FilterResponse, Roles} from "../types";
import {verifyToken} from "../../../shared/jwtService";
import {NextFunction, RequestHandler} from "express";
import {Request} from "express-serve-static-core";
import UserModel from "../models/userModel";


export const checkOwnerFilter: RequestHandler = async (req, res, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    try {
        const jwtDecoded = verifyToken(accessToken, false);
        const user = await UserModel.findById(jwtDecoded.userId);
        if(user && user._id.toString() === req.path.split("/")[req.path.split("/").length-1])
            next();
    } catch (error: any) {
        return {response: false, error: error.message, id: undefined};
    }
};

export const jwtUserRequestFilter: RequestHandler = async (req, res, next: NextFunction) => {
    const result = await jwtRequestFilter(req, Roles.USER);
    if (result){
        result.response ? next() : res.status(401).json({message: result.error});
    }

};

export const jwtAdminRequestFilter: RequestHandler = async (req, res, next: NextFunction) => {
    const result = await jwtRequestFilter(req, Roles.ADMIN);
    if (result)
        result.response ? next() : res.status(401).json({message: result.error});
};

export const jwtModeratorRequestFilter: RequestHandler = async (req, res, next: NextFunction) => {
    const result = await jwtRequestFilter(req, Roles.MODERATOR);
    if (result)
        result.response ? next() : res.status(401).json({message: result.error});
};


const jwtRequestFilter = async (req: Request, minRole: Roles): Promise<FilterResponse | undefined> => {
    if (!checkEndpoint(req.method, req.url)) return {response: true, error: undefined, id: undefined};
    const accessToken = req.cookies.accessToken;
    try {
        const jwtDecoded = verifyToken(accessToken, false);
        const user = await UserModel.findById(jwtDecoded.userId);
        if (!user) return {response: false, error: "Пользователь не найден", id: undefined};
        if (user.superUser && !user.groups) return {response: true, error: undefined, id: user._id.toString()};
        const role = user.groups && user.groups.role;
        return role && role >= minRole ?
            {response: true, error: undefined, id: user._id.toString()} :
            {response: false, error: "Доступ запрещен",id: undefined};
    } catch (error: any) {
        return {response: false, error: error.message, id: undefined};
    }
};

const checkEndpoint = (method: string, url: string): boolean => {
    const isRefresh: boolean = method === "POST" && url === "/refresh";
    const isSignIn: boolean = method === "POST" && url === "/signin";
    return !(isRefresh || isSignIn);
};



