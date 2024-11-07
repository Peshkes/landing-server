import bcrypt from "bcryptjs";
import UserModel from "../modules/authentication/models/userModel";

export const createAdminUser = async () =>  {
    const password = await bcrypt.hash("12345678v!", 10);
    try {
        await UserModel.create({
            name: "admin",
            email: "admin@gmail.com",
            password: password,
            roles: "admin"
        });
        console.log("Админ успешно создан");
    } catch (error:any) {
        throw new Error(`Ошибка при создании пользователя: ${error.message}`);
    }
};

