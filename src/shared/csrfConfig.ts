import {doubleCsrf} from "csrf-csrf";
import crypto from "crypto";


const CSRF_TOKEN_SECRET = crypto.randomBytes(64).toString("hex");

export const {generateToken, doubleCsrfProtection} = doubleCsrf({
    getSecret: () => CSRF_TOKEN_SECRET,
    size: 64,
    ignoredMethods: ["GET"],
    getTokenFromRequest: (req) => req.headers["x-csrf-token"]
});

// function doubleCsrfProtection(req:Request, res:Response, next:NextFunction) {
//     const token = req.headers["x-csrf-token"];
//     req.csrfToken = token;
//     return originalDoubleCsrfProtection(req, res, next);
// }