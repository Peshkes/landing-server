import bcrypt from "bcryptjs";
import UserModel from "../models/userModel";
import {signIn} from "./authenticationJWTService";
import {
    AuthenticationResult, EmailToSend, PublicUserData, ResetPasswordObject,
    Roles, User, UserData
} from "../types";
import mongoose from "mongoose";
import {Group} from "../../group/groupTypes";
import GroupModel from "../../group/models/groupModel";
import TokenModel from "../models/tokenModel";
import crypto from "crypto";
import {sendEmail} from "../../../shared/mailingServise";
import {deleteDraftOfferById, deletePublicOfferById} from "../../offer/services/offerService";

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
        const account: User | null = isObjectId ? await UserModel.findById(obj) : await UserModel.findOne({email: obj});
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
        const account: User | null = isObjectId ? await UserModel.findById(obj) : await UserModel.findOne({email: obj});
        if (!account) throw new Error("Пользователь не найден");
        if (await bcrypt.compare(newPassword, account.password))
            throw new Error("Новый пароль не должен совпадать со старым");
        const lastPasswords = account.lastPasswords;
        for (const pass of account.lastPasswords) {
            if (await bcrypt.compare(newPassword, pass))
                throw new Error("Этот пароль уже был использован. Пожайлуйста придумайте другой пароль");
        }
        lastPasswords.unshift(account.password);
        if (lastPasswords.length > 3)
            lastPasswords.pop();

        await UserModel.updateOne({
            account: account._id,
            password: await bcrypt.hash(newPassword, 10),
            lastPasswords: lastPasswords
        });
    } catch (error: any) {
        throw new Error(`Ошибка при обновлении пароля: ${error.message}`);
    }
};

const resetPasswordRequest = async (email: string): Promise<string> => {
    const existingUser = await UserModel.findOne({email});
    if (!existingUser) throw new Error("Пользователся с таким имейлом не найдено");
    const token = await TokenModel.findOne({ userId: existingUser._id });
    if (token) await token.deleteOne();
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);
    await new TokenModel({
        userId: existingUser._id,
        token: hash,
        createdAt: Date.now()
    }).save();

    const link = `localhost:27000/account/reset_password/${resetToken}`;
    const emailToSend: EmailToSend = {
        from: "no_reply@snapitch.com",
        to: "dioujikov@gmail.com",
        subject: "Запрос на сброс пароля",
        text: "Для сброса пароля пожалуйста пройдите по этой ссылке",
        link: link,
        html: "<b>Для сброса пароля пожалуйста пройдите по <a href={link && link} >этой ссылке</a></b>"
    };

    await sendEmail(emailToSend);
    return link;
};

const resetPassword = async (obj:ResetPasswordObject) => {
    const {userId, token, newPassword} = obj;
    const passwordResetToken = await TokenModel.findOne({ userId });
    if (!passwordResetToken || !await bcrypt.compare(token, passwordResetToken.token)) throw new Error("Токен смены пароля некорректен или истек");
    await changePassword(userId, newPassword);
    await TokenModel.findByIdAndDelete(userId);
};


const copyOffersToGroup = async (publicOffersToMove: string[], draftOffersToMove: string[], groupId: string) => {
    try {
        const group: Group | null = await GroupModel.findById(groupId);
        if (!group) throw new Error("Группы с таким ID: " + groupId + " не найдено");
        publicOffersToMove && group.publicOffers.push(...publicOffersToMove);
        draftOffersToMove && group.publicOffers.push(...draftOffersToMove);
    } catch (error: any) {
        throw new Error(`Ошибка при добавлении коммерческих предложений в группу: ${error.message}`);
    }
};

const deleterArrayOfOffers = async (offersToDelete: string[], isPublic: boolean) => {
    try {
        offersToDelete.forEach(async id => isPublic ? await deletePublicOfferById(id) : await deleteDraftOfferById(id));
    } catch (error: any) {
        throw new Error(`Ошибка при удалении коммерческих предложений: ${error.message}`);
    }
};

const passwordIsValid = (password: string): boolean => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);


export {
    registrateUser,
    getAccountByEmailOrId,
    getAllAccounts,
    deleteAccountById,
    changePassword,
    resetPasswordRequest,
    resetPassword,
    copyOffersToGroup,
    deleterArrayOfOffers
};


