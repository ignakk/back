import { Router } from "express";

import { BlogController, adminController } from "../controllers/index.js"
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { authMiddleware } from "../middlewares/index.js";

const router = new Router();

router.get("/article", BlogController.showAllArticles);
router.post("/create", authMiddleware, BlogController.create);

router.get('/articles-to-moderate', adminMiddleware, BlogController.articlesToModerate);
router.post('/article-approve', adminMiddleware, BlogController.approveArticle);
router.post('/decline-article', adminMiddleware, BlogController.deleteArticle);

router.get("/article/:id", BlogController.showArticleById);
router.post("/delete", authMiddleware, BlogController.delete);
router.get("/change/:id", BlogController.showArticleById);
router.post("/change/:id", authMiddleware, BlogController.update);

router.post("/authorization", adminController.authorization);
router.post("/registration", adminController.registration);

router.get("/refresh", adminController.refresh);

export default router;