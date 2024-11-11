
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel";
import {signIn} from "./authenticationJWTService";
import {AuthenticationResult, PublicUserData, Roles, User, UserData} from "../types";
import mongoose from "mongoose";

const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


const registrateUser = async (userData: UserData): Promise<AuthenticationResult> => {
    try {
        const {name, email, password} = userData;

        const existingUser = await UserModel.findOne({email});
        if (existingUser) throw new Error("Email уже занят");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            superUser: true,
            name,
            email,
            password: hashedPassword,
            role: Roles.USER,
            lastPasswords: [],
            subscription: null,
            publicOffers: [],
            draftOffers: []
        });

        await newUser.save();

        return signIn({email, password});
    } catch (error: any) {
        throw new Error(`Ошибка при создании пользователя: ${error.message}`);
    }
};

const getAccountByEmailOrId = async (obj: string): Promise<PublicUserData> => {
    const isObjectId = mongoose.Types.ObjectId.isValid(obj);
    try {
        const account: User | null = isObjectId ? await UserModel.findById(obj) : await UserModel.findOne({ email: obj });
        if (!account) throw new Error("Пользователся с таким имейлом не найдено");
        return {email: account.email, name: account.name, _id: account._id};
    } catch (error: any) {
        throw new Error(`Ошибка при получении аккаунта: ${error.message}`);
    }
};

const getAllAccounts = async (): Promise<PublicUserData[]> => {
    try {
        const accounts: User[] = await UserModel.find();
        return accounts.map(user => ({
            superUser: true,
            email: user.email,
            name: user.name,
            _id: user._id,
            subscription: user.subscription,
            publicOffers: user.publicOffers,
            draftOffers: user.draftOffers
        }));
    } catch (error: any) {
        throw new Error(`Ошибка при получении списка аккаунтов: ${error.message}`);
    }
};

const deleteAccountById = async (id: string): Promise<PublicUserData> => {
    try {
        const account: User | null = await UserModel.findByIdAndDelete(id); //findOneAndDelete({ _id: id }).
        if (!account) throw new Error("Пользователь не найден");
        return {email: account.email, name: account.name, _id: account._id};
    } catch (error: any) {
        throw new Error(`Ошибка при удалении аккаунта: ${error.message}`);
    }
};

const changePassword = async (obj: string, newPassword: string): Promise<void> => {
    const isObjectId = mongoose.Types.ObjectId.isValid(obj);
    try {
        if (!passwordIsValid(newPassword)) throw new Error("Пароль должен сожержать на менее 8 символов, включая заглавную букву, цифру, спетциальный символ (@$!%*?&)");
        const account: User | null = isObjectId ? await UserModel.findById(obj) : await UserModel.findOne({ email: obj });
        if (!account) throw new Error("Пользователь не найден");
        if (await bcrypt.compare(newPassword, account.password))
            throw new Error("Новый пароль не должен совпадать со старым");
        const lastPasswords = account.lastPasswords;
        for (const pass of account.lastPasswords) {
            if (await bcrypt.compare(newPassword, pass))
                throw new Error("Этот пароль уже был использован. Пожайлуйста придумайте другой пароль");
        }
        //account.password = await bcrypt.hash(newPassword, 10);
        lastPasswords.unshift(account.password);
        if (lastPasswords.length > 3)
            lastPasswords.pop();

        await UserModel.updateOne({account: account._id, password: await bcrypt.hash(newPassword, 10), lastPasswords: lastPasswords});
    } catch (error: any) {
        throw new Error(`Ошибка при обновлении пароля: ${error.message}`);
    }
};

const passwordIsValid = (password: string): boolean => regexp.test(password);


export {
    registrateUser,
    getAccountByEmailOrId,
    getAllAccounts,
    deleteAccountById,
    changePassword
};


