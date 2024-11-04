import {AuthenticationData, AuthenticationResult, User} from "../types";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel";
import {generateTokenPair, verifyToken} from "../../../shared/JWTServise";



const signIn = async (authenticationData: AuthenticationData): Promise<AuthenticationResult> => {

    const email = authenticationData.email;

    const existingUser: User | null = await UserModel.findOne({email});
    if (!existingUser) throw new Error("Пользователь с имейлом " + email + " не найден");

    const password = existingUser.password;

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) throw new Error("Неверный пароль");

    return generateTokenPair(existingUser._id, existingUser.role);
};


const refreshToken = async (token: string) => {
    if (!token) throw new Error("Токен не пришел ");
    const decodedToken = verifyToken(token);
    return generateTokenPair(decodedToken.userId, decodedToken.role);
};


export {signIn, refreshToken};



