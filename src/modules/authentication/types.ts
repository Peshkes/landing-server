import {ObjectId} from "mongoose";

export type AuthenticationData = {
    email: string;
    password: string;
}

export type UserData = AuthenticationData & {
    name: string;
}

export type User = UserData & {
    role: string;
    _id: ObjectId
    lastPasswords: string[]
}

export type PublicUserData = {
    email: string;
    name: string;
    _id: ObjectId
    role: string;
}

export type AuthenticationResult = {
    accessToken: string;
    refreshToken: string;
}

export type CustomCookies = {
    cookies: {
        accessToken: string;
        refreshToken: string;
    }
}

export type JwtTokenPayload = {
    userId: string;
    role: string;
}



