import bcrypt from "bcrypt";

import { AdminModel, tokenModel } from "../models/index.js";
import { userDto } from "../dtos/index.js";
import { TokenService } from "./index.js";

class AdminService {

    async authorization(email, password) {
        if(!email || !password) {
            throw new Error("Проверьте правильность введенных данных");
        }
        const user = await AdminModel.findOne({email});

        if(!user) {
            throw new Error("Такого пользователя не существует");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword) {
            throw new Error("Неправильно введен пароль");
        }

        const modifiedUser = new userDto(user);

        const tokens = await TokenService.generateTokens({...modifiedUser});
        await TokenService.saveToken(modifiedUser.id, tokens.refreshToken);

        return {
            message: "Вы успешно авторизированы",
            ...tokens,
            user: modifiedUser,
        }
    }

    async registration(email, password) {
        if(!email || !password) {
            throw new Error("Проверьте правильность введенных данных");
        }
        const user = await AdminModel.findOne({email});

        if(user) {
            throw new Error("Такой пользователь уже существует");
        }

        const hashPassword = bcrypt.hashSync(password, 6);

        const newUser = new AdminModel({email, password: hashPassword, isAdmin: false});
        await newUser.save();

        const tokens = await TokenService.generateTokens({...newUser});
        await TokenService.saveToken(newUser.id, tokens.refreshToken);

        return {
            message: "Вы успешно авторизированы",
            ...tokens,
            user: newUser
        }
    }

    async refresh(refreshToken, userData) {
        if(!refreshToken) {
            throw new Error("Пользователь не авторизован");
        }

        const user = await AdminModel.findById(userData.id);
        const modifiedUser = new userDto(user);

        const tokens = await TokenService.generateTokens({...modifiedUser});
        await TokenService.saveToken(modifiedUser.id, tokens.refreshToken);

        return {
            ...tokens,
            user: modifiedUser
        }

    }


    // logout and moderate and name logic
}

export default new AdminService();