import RoleModel from "../models/roleModel";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel";
import {signIn} from "./authenticationJWTService";
import {AuthenticationResult, PublicUserData, User, UserData} from "../types";

const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


const registrateUser = async (userData: UserData): Promise<AuthenticationResult> => {
    try {
        const {name, email, password} = userData;

        const existingUser = await UserModel.findOne({email});
        if (existingUser) throw new Error("Email уже занят");

        const role = await RoleModel.findOne({name: "user"});
        if (!role) throw new Error("Роль пользователя не найдена");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role: role._id
        });

        await newUser.save();

        return signIn({email, password});
    } catch (error: any) {
        throw new Error(`Ошибка при создании пользователя: ${error.message}`);
    }
};

const getAccountByEmailOrId = async (obj: string): Promise<PublicUserData> => {
    try {
        const account: User | null = await UserModel.findOne({obj});
        if (!account) throw new Error("Пользователся с таким имейлом не найдено");
        return {email: account.email, name: account.name, _id: account._id, role: account.role};
    } catch (error: any) {
        throw new Error(`Ошибка при получении аккаунта: ${error.message}`);
    }
};

const getAllAccounts = async (): Promise<PublicUserData[]> => {
    try {
        const accounts: User[] = await UserModel.find({});
        if (accounts.length == 0) throw new Error("Ни одного аккаунта не найдено ");
        return accounts.map(user => ({
            email: user.email, name: user.name, _id: user._id, role: user.role
        }));
    } catch (error: any) {
        throw new Error(`Ошибка при получении списка аккаунтов: ${error.message}`);
    }
};

const deleteAccountById = async (id: string): Promise<PublicUserData> => {
    try {
        const account: User | null = await UserModel.findByIdAndDelete({id});
        if (!account) throw new Error("Пользователь не найден");
        return {email: account.email, name: account.name, _id: account._id, role: account.role};
    } catch (error: any) {
        throw new Error(`Ошибка при удалении аккаунта: ${error.message}`);
    }
};

const changePassword = async (obj: string, newPassword: string): Promise<void> => {
    try {
        if (!passwordIsValid(newPassword)) throw new Error("Пароль должен сожержать на менее 8 символов, включая заглавную букву, цифру, спетциальный символ (@$!%*?&)");
        const account: User | null = await UserModel.findOne({obj});
        if (!account) throw new Error("Пользователь не найден");
        if (await bcrypt.compare(newPassword, account.password))
            throw new Error("Новый пароль не должен совпадать со старым");
        const lastPasswords = account.lastPasswords;
        for (const pass in account.lastPasswords) {
            if (await bcrypt.compare(newPassword, pass))
                throw new Error("Этот пароль уже был использован. Пожайлуйста придумайте другой пароль");
        }
        account.password = await bcrypt.hash(newPassword, 10);
        lastPasswords.unshift(account.password);
        if (lastPasswords.length > 3)
            lastPasswords.pop();
        await UserModel.updateOne({account});
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


