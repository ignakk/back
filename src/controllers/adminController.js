import { AdminService } from "../service/index.js";

class adminController {

    async authorization(req, res) {
        try {
            const { email, password } = req.body;
            const user = await AdminService.authorization(email, password);
            res.cookie("refreshToken", user.refreshToken, {maxAge: 30*24*60*60*1000});
            return res.json(user);
            
        } catch (e) {
            res.status(401).json(e.message)
        }
    }

    async registration(req, res) {
        try {
            const {email, password} = req.body;
            const user = await AdminService.registration(email, password);
            res.cookie("refreshToken", user.refreshToken, {maxAge: 30*24*60*60*1000});
            return res.json(user);
        } catch (e) {
            res.status(401).json("Произошла ошибка при регистрации");
        }
    }

    async refresh(req, res) {
        try {
            const {refreshToken} = req.cookies;
            const user = await AdminService.refresh(refreshToken, req.user);
            res.cookie("refreshToken", user.refreshToken, {maxAge: 30*24*60*60*1000});
            res.clearCookie('refreshToken');
            return res.json(user);
        } catch (e) {
            res.status(401).json("Пользователь не авторизован " + e.message,);
        }
       
    }

}

export default new adminController();