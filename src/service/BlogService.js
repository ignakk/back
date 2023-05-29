import { orderByAdapter } from "../adapters/index.js";
import { blogModel } from "../models/index.js"


class BlogService {

    async create(title, text, avatar) {
        if(!title || text || avatar) {
            throw new Error("Убедитесь что все поля заполнены!")
        }

        const blog = await new blogModel(title, text, avatar, false);
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

    async showArticlesToModerate() {
        const skip = (parseInt(page) - 1) * 8;

        const articles = (await blogModel.find().limit(8).skip(skip));

        return articles.length > 0 ? articles.filter((item) => !item.isVisible) : [];
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