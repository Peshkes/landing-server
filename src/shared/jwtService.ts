import jwt from "jsonwebtoken";
import crypto from "crypto";
import {JwtTokenPayload} from "../modules/authentication/types";
import UserModel from "../modules/authentication/models/userModel";


const ACCESS_EXPIRATION_TIME = 300;
const REFRESH_EXPIRATION_TIME = 900;
const ACCESS_TOKEN_SECRET = crypto.randomBytes(64).toString("hex");
const REFRESH_TOKEN_SECRET = crypto.randomBytes(64).toString("hex");


const generateToken = (_id: string, ACCESS_TOKEN_SECRET: string, expirationTime: number, role?: string) => {
    return jwt.sign(
        {userId: _id, role},
        ACCESS_TOKEN_SECRET,
        {expiresIn: expirationTime}
    );
};


const verifyToken = (token: string, isRefresh: boolean): JwtTokenPayload => {
    const key = isRefresh ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET;
    try {
        const jwtPayload = jwt.verify(token, key) as JwtTokenPayload;
        if (!jwtPayload || !jwtPayload.userId) throw new Error("В токене не хватает данных");
        if (!checkUserExistsInToken(jwtPayload.userId)) throw new Error("Пользователь не найден");
        return jwtPayload;
    } catch (error: any) {
        throw new Error("Токен не валиден: " + error.message);
    }
};

const checkUserExistsInToken = async (userId: string) => {
    const response = await UserModel.exists({userId});
    return response;
};

const generateTokenPair = (_id: string, role: string) => {
    return {
        accessToken: generateToken(_id, ACCESS_TOKEN_SECRET, ACCESS_EXPIRATION_TIME, role),
        refreshToken: generateToken(_id, REFRESH_TOKEN_SECRET, REFRESH_EXPIRATION_TIME)
    };
};

export {
    generateTokenPair,
    verifyToken,
    ACCESS_EXPIRATION_TIME,
    REFRESH_EXPIRATION_TIME
};

