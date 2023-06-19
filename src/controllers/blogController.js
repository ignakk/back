
import { BlogService } from "../service/index.js";

class BlogController {

    async create(req, res) {
        try {
            const {title, text, avatar} = req.body;
            const article = await BlogService.create(req.user.email, title, text, avatar);
            return res.json(article);
        } catch (e) {
            res.status(400).json(e.message)
        }
    }

    async showAllArticles(req, res) {
        try {
            const { page, filterBy, orderBy } = req.query;
            const article = await BlogService.showAllArticles(page, filterBy, orderBy);
            return res.json(article);
        } catch (e) {
            res.status(404).json(e.message);
        }
    }

    async showArticleById(req, res) {
        try {
            const articleId = req.params.id;
            const article = await BlogService.showArticleById(articleId, req.user.isAdmin);
            return res.json(article);
        } catch (e) {
            res.status(404).json(e.message);
        }
    }

    async delete(req, res) {
        try {
            const {articleId} = req.body;
            const article = await BlogService.delete(articleId);
            return res.json(article.message);
        } catch (e) {
            res.status(400).json(e.message)
        }
    }

    async update(req, res) {
        try {
            const {title, text, avatar} = req.body;
            const articleId = req.params.id;
            const article = await BlogService.update(articleId, title, text, avatar);
            return res.json(article)
        } catch (e) {
            res.status(400).json(e.message)
        }
    }

    async articlesToModerate(req, res) {
        try {
            const { page } = req.query;
            const article = await BlogService.showArticlesToModerate(page);
            return res.json(article);
        } catch (e) {
            res.status(400).json(e.message)
        }
    }

    async approveArticle(req, res) {
        try {
            const {id} = req.body;
            const response = await BlogService.approveArticle(id);
            return res.json(response);
        } catch (error) {
            res.status(400).json(e.message)
        }
    }

    async deleteArticle(req, res) {
        try {
            const {id} = req.body;
            const response = await BlogService.deleteArticle(id);
            return res.json(response);
        } catch (error) {
            res.status(400).json(e.message)
        }
    }

}

export default new BlogController();