import {ObjectId} from "mongoose";

export type AuthenticationData = {
    email: string;
    password: string;
}

export type UserData = AuthenticationData & {
    name: string;
}

export type User = UserData & {
    superUser: boolean
    _id: ObjectId
    lastPasswords: string[]
    subscription: null
    publicOffers: string[]
    draftOffers: string[]
}

export type PublicUserData = {
    email: string;
    name: string;
    _id: ObjectId
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
}

export type AccessPayload = {
    accountId: string;
    role: Roles
}

export enum Roles {
    USER = 10, MODERATOR = 20, ADMIN = 30
}

export type MoveOffersRequest = {
    publicOffersToMove: string[];
    draftOffersToMove: string[];
}

export type GroupAccess = Map<string, Roles>

