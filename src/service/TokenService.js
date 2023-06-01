import jwt from "jsonwebtoken";

import { tokenModel } from "../models/index.js";

class TokenService {

    async generateTokens(payload) {
        const accesToken =  jwt.sign(payload, 'secret', {expiresIn: "30m"});
        const refreshToken = jwt.sign(payload, 'secret', {expiresIn: "7d"});
        return {
            accesToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId});

        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return await tokenData.save();
        }

        const token = await tokenModel({user: userId, refreshToken: refreshToken});
        await token.save();

        return token;
    }

    validateRefreshToken(refreshToken)  {
        const userData = jwt.verify(refreshToken, 'secret');
        return userData;
    }

    validateAccesToken(accesToken) {
        const userData = jwt.verify(accesToken, 'secret');
        return userData;
    }

}

export default new TokenService();