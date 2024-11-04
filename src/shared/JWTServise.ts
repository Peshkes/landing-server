import jwt from "jsonwebtoken";
import crypto from "crypto";
import {ObjectId} from "mongoose";


const ACCESS_EXPIRATION_TIME = "5m";
const REFRESH_EXPIRATION_TIME = "15m";
const ACCESS_TOKEN_SECRET = crypto.randomBytes(64).toString("hex");
const REFRESH_TOKEN_SECRET = crypto.randomBytes(64).toString("hex");

const generateToken = (_id: ObjectId, role: string, ACCESS_TOKEN_SECRET: string, expirationTime: string) => {
    return jwt.sign(
        {userId: _id, role},
        ACCESS_TOKEN_SECRET,
        {expiresIn: expirationTime}
    );
};

const verifyToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
};

const generateTokenPair = (_id: ObjectId, role: string) =>{
    return {
        accessToken: generateToken(_id, role, ACCESS_TOKEN_SECRET, ACCESS_EXPIRATION_TIME),
        refreshToken: generateToken(_id, role, REFRESH_TOKEN_SECRET, REFRESH_EXPIRATION_TIME)
    };
};

export {generateTokenPair,verifyToken};

