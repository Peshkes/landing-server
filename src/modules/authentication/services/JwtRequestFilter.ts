import {JwtTokenPayload} from "../types";
import {verifyToken} from "../../../shared/jwtService";
import {RequestHandler} from "express";
import {Request} from "express-serve-static-core";


export const jwtUserRequestFilter: RequestHandler = (req, res, next: () => void): void => {
    const role: string | undefined = jwtRequestFilter(req);
    if (role && role === "user")
        next();
};

export const jwtAdminRequestFilter: RequestHandler = (req, res, next: () => void): void => {
    const role: string | undefined = jwtRequestFilter(req);
    if (role && role === "admin")
        next();
};

export const jwtModeratorRequestFilter: RequestHandler = (req, res, next: () => void): void => {
    const role: string | undefined = jwtRequestFilter(req);
    if (role && role === "moderator")
        next();
};


const jwtRequestFilter = (req: Request): string | undefined => {
    if (checkEndpoint(req.method, req.url)) {
        const accessToken = req.cookies.accessToken;
        if (accessToken) {
            let jwtDecoded: JwtTokenPayload;
            try {
                jwtDecoded = verifyToken(accessToken, false);
            } catch (error: any) {
                throw new Error(error.message);
            }
            return jwtDecoded.role;
        }
    }
};

const checkEndpoint = (method: string, url: string): boolean => {
    const isRefresh: boolean = method === "POST" && url === "/refresh";
    const isSignIn: boolean = method === "POST" && url === "/signin";
    return !(isRefresh || isSignIn);
};



