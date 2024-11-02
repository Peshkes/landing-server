import User from "../models/userModel";
import {UserData} from "../types";
import Role from "../models/roleModel";
import bcrypt from "bcryptjs";

export const registrateUser = async (userData: UserData) => {
    try {
        const { name, email, password} = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error("Email уже занят");

        const role = await Role.findOne({ name: "user" });
        if (!role) throw new Error("Роль пользователя не найдена");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
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
