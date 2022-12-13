const Article = require("./articles.schema");

class ArticleService {
  create(data) {
    //const article = new Article({title : data.title, content : data.content, status: data.status,  user : userId});
    const article = new Article(data);
    return article.save();
  }
  update(id, data) {
    const article = Article.findByIdAndUpdate(id, data, { new: true });
    return article;
  }
  delete(id) {
    return Article.findByIdAndDelete(id);
  }
}

module.exports = new ArticleService();
