import UserModel from "../models/userModel";
import {User, UserData} from "../types";
import RoleModel from "../models/roleModel";
import bcrypt from "bcryptjs";

export const registrateUser = async (userData: UserData): Promise<User> => {
    try {
        const { name, email, password} = userData;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) throw new Error("Email уже занят");

        const role = await RoleModel.findOne({ name: "user" });
        if (!role) throw new Error("Роль пользователя не найдена");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role: role._id
        });

        await newUser.save();

        return newUser;
    } catch (error: any) {
        throw new Error(`Ошибка при создании пользователя: ${error.message}`);
    }
};
