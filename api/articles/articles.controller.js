const UnauthorizedError = require("../../errors/unauthorized");
const articlesService = require("./articles.service");




class ArticlesController {

    async create(req, res, next){
        try {
            const article = await articlesService.create(req.body);
            req.io.emit('article:create', article);
            res.status(201).json(article);
            
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next){
        const role = req.user.role;

            try {

        if (role == 'admin') {
            const id = req.params.id;
            const data = req.body;
            const article = await articlesService.update(id, data);
            res.status(200).json(article);
            
        } else {
            throw new UnauthorizedError()
        }
            } catch (error) {
                next(error)
            }
       
    }

    async delete(req, res, next){
        const role = req.user.role;
        try {
            if (role == 'admin') {
                const id = req.params.id;
                await articlesService.delete(id);
                req.io.emit("article:delete", { id })
                res.status(204).json({
                    msg : "article deleted successfuly"
                }).send();
                
            } else {
                throw new UnauthorizedError()
            }
           
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new ArticlesController()