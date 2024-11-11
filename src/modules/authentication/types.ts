import {ObjectId} from "mongoose";

export type AuthenticationData = {
    email: string;
    password: string;
}

export type UserData = AuthenticationData & {
    name: string;
}

export type User = UserData & {
    superUser: true
    groups: GroupAccess
    _id: ObjectId
    lastPasswords: string[]
    subscription: null
    publicOffers: []
    draftOffers: []

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

export enum Roles  {
    USER, MODERATOR, ADMIN
}

export type GroupAccess = {
    id: string;
    group_id: string;
    role: Roles;
}

export type FilterResponse = {
    response: boolean
    error: string | undefined
    id: string | undefined
}






