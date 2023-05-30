import { orderByAdapter } from "../adapters/index.js";
import { blogModel, AdminModel } from "../models/index.js"


class BlogService {

    async create(email, title, text, avatar) {
        const user = await AdminModel.findOne({email});

        const blog = await new blogModel({name: user.email, title, text, isVisible: false, avatar});
        blog.save();

        return {
            message: "Статья успешно создана",
            blog: blog
        }
    }

    async showAllArticles(page, filterBy = '', orderBy = 'desc') {
        const skip = (parseInt(page) - 1) * 8;

        const articles = (await blogModel.find().limit(8).skip(skip).sort({ createdAt: orderByAdapter(orderBy) }));

        return articles.length > 0 ? articles.filter((item) => item.title.toLowerCase().startsWith(filterBy) && !!item.isVisible) : [];
    }

    async showArticlesToModerate(page = 1) {
        const skip = (parseInt(page) - 1) * 8;

        const articles = (await blogModel.find().limit(8).skip(skip));

        return articles.length > 0 ? articles.filter((item) => !item.isVisible) : [];
    }

    async approveArticle(id) {
        if(!id) {
            throw new Error("Ошибка при согласовании поста");
        }

        const article = blogModel.updateOne({_id: id}, {$set: {isVisible: true}});

        return article;
    }

    async deleteArticle(id) {
        if(!id) {
            throw new Error("Ошибка при согласовании поста");
        }

        return await this.delete(id);
    }

    async showArticleById(articleId) {
        const article = await blogModel.findById(articleId);

        if(!article) {
            throw new Error("Такой статьи не существует");
        }

        await blogModel.updateOne({_id: articleId}, {$inc: {viewsCount: 1}});

        if(!article.isVisible) {
            throw new Error("Такой статьи не существует");
        }

        return article;
    }

    async delete(articleId) {
        const article = await blogModel.deleteOne({_id: articleId});
        return {message: `Статья успешно удалена`};
    }

    async update(articleId, title, text, avatar) {
        if(!articleId) {
            throw new Error("Такой статьи не существует")
        }
        const article = blogModel.updateOne({_id: articleId}, {$set: {title: title, text: text, avatar: avatar}})

        return article
    }

}

export default new BlogService();