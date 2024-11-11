import {AuthenticationData, AuthenticationResult, JwtTokenPayload, User} from "../types";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel";
import {generateTokenPair, verifyToken} from "../../../shared/jwtService";


const signIn = async (authenticationData: AuthenticationData): Promise<AuthenticationResult> => {
    const existingUser: User | null = await UserModel.findOne({email: authenticationData.email});
    if (!existingUser) throw new Error("Пользователь с имейлом " + authenticationData.email + " не найден");

    const isPasswordCorrect = await bcrypt.compare(authenticationData.password, existingUser.password);
    if (!isPasswordCorrect) throw new Error("Неверный пароль");
    return generateTokenPair(existingUser._id.toString());
};

const refreshToken = async (token: string) => {
    if (!token) throw new Error("Токен не пришел ");
    const decodedToken:JwtTokenPayload = verifyToken(token, true);
    return generateTokenPair(decodedToken.userId);
};


export {signIn, refreshToken};



