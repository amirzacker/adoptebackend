const UnauthorizedError = require("../../errors/unauthorized");
const searchTypesService = require("./searchTypes.service");




class SearchTypesController {

    async getAll(req, res, next) {
        try {
          const searchTypes = await searchTypesService.getAll();
          res.json(searchTypes);
        } catch (err) {
          next(err);
        }
      }

    async create(req, res, next){
        try {
            const searchTypes = await searchTypesService.create(req.body);
            req.io.emit('searchType:create', searchTypes);
            res.status(201).json(searchTypes);
            
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next){
        //const role = req.user.role;

            try {

    /*     if (role == 'admin') {
            const id = req.params.id;
            const data = req.body;
            const domains = await domainsService.update(id, data);
            res.status(200).json(domains);
            
        } else {
            throw new UnauthorizedError()
        } */

            const id = req.params.id;
            const data = req.body;
            const searchTypes = await searchTypesService.update(id, data);
            res.status(200).json(searchTypes);
       
            } catch (error) {
                next(error)
            }
       
    }

    async delete(req, res, next){
        //const role = req.user.role;
        try {
          /*   if (role == 'admin') {
                const id = req.params.id;
                await domainsService.delete(id);
                req.io.emit("domain:delete", { id })
                res.status(204).json({
                    msg : "domain deleted successfuly"
                }).send();
                
            } else {
                throw new UnauthorizedError()
            } */
                const id = req.params.id;
                await searchTypesService.delete(id);
                req.io.emit("searchType:delete", { id })
                res.status(204).send();
                
           
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new SearchTypesController()