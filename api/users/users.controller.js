const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const usersService = require("./users.service");


class UsersController {
  async getAll(req, res, next) {
    try {
      const users = await usersService.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const user = await usersService.getById(id);
      if (!user) {
        throw new NotFoundError();
      }
      res.json(user);
     
    } catch (err) {
      next(err);
    }
  }
  async getByEmail(req, res, next) {
    try {
      const email = req.params.email;
      const user = await usersService.getByEmail(email);
      if (!user) {
        throw new NotFoundError();
      }
      res.json(user);
     
    } catch (err) {
      next(err);
    }
  }
  async getByDomain(req, res, next) {
    try {
      const domain = req.query.domain;
      const user = await usersService.getByDomain(domain);
      if (!user) {
        throw new NotFoundError();
      }
      res.json(user);
     
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const user = await usersService.create(req.body);
      user.password = undefined;
      req.io.emit("user:create", user);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
      try {
        if (req.body.id == req.params.id || req.user.isAdmin){
          const id = req.params.id;
          const data = req.body;
          const userModified = await usersService.update(id, data);
          userModified.password = undefined;
          res.json(userModified);
        }
        else {
          return res.status(403).json("You can update only your account!");
        }
      } catch (err) {
        next(err);
      }
   
  }
  async delete(req, res, next) {
    if (req.body.id == req.params.id || req.user.isAdmin) {
      try {
        const id = req.params.id;
        await usersService.delete(id);
        req.io.emit("user:delete", { id });
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    } 
    else {
      return res.status(403).json("You can delete only your account!");
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userId = await usersService.checkPasswordUser(email, password);
      if (!userId) {
        throw new UnauthorizedError();
      }
      const user = await usersService.getById(userId);
      const token = jwt.sign({ userId }, config.secretJwtToken, {
        expiresIn: "3d",
      });

      res.json({
        token,
        user
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllUserArticle(req, res, next){
    try {
      const id = req.params.id;
      const article = await usersService.getAllUserArticle(id);
      res.json(article);

    } catch (error) {
      next(error);
    }
  }

  async adopte(req, res, next){

    if (req.body.id !== req.params.id) {
      try {
        const user = await usersService.getById(req.params.id);
        const currentUser = await usersService.getById(req.body.id);
        //console.log(currentUser);
        if (!user.isAdopted.includes(req.body?.id)) {
          await user.updateOne({ $push: { isAdopted: req.body.id } });
          await currentUser.updateOne({ $push: { adoptions: req.params.id } });
          res.status(200).json("user has been adopted");
        } else {
          res.status(403).json("you allready adopte this user");
        }
      } catch (err) {
        next(err);
      }
    } else {
      res.status(403).json("you can't adopte yourself");
    }
  }

  async unadopte(req, res, next){

    if (req.body.id !== req.params.id) {
      try {
        const user = await usersService.getById(req.params.id);
        console.log(req.body.id);
        const currentUser = await usersService.getById(req.body.id);
        if (user.isAdopted.includes(req.body.id)) {
          await user.updateOne({ $pull: { isAdopted: req.body.id } });
          await currentUser.updateOne({ $pull: { adoptions: req.params.id } });
          res.status(200).json("user has been unadopted");
        } else {
          res.status(403).json("you don't adopte this user");
        }
      } catch (err) {
        next(err);
      }
    } else {
      res.status(403).json("you can't unadopte yourself");
    }
  }

  async adoptions(req, res, next){

    try {
      const user = req.user;
      console.log(user);
       if (user.isCompany) {
        const adoptions = await Promise.all(
          user.adoptions.map((studentsId) => {
            return usersService.getById(studentsId);
          })
        );
        let studentsList = [];
        adoptions.map((student) => {
          const { _id, firstname,lastname, profilePicture, domain, searchType } = student;
          studentsList.push({ _id, firstname,lastname, profilePicture, domain , searchType });
        });
        res.status(200).json(studentsList) 
       } else if (user.isStudent) {
        const adoptions = await Promise.all(
          user.isAdopted.map((CompaniesId) => {
            return usersService.getById(CompaniesId);
          })
        );
        let CompaniesList = [];
        adoptions.map((company) => {
          const { _id, name, profilePicture } = company;
          CompaniesList.push({ _id, name, profilePicture });
        });
        res.status(200).json(CompaniesList) 
       } else{
        throw new UnauthorizedError();
       }
      
    } catch (err) {
      next(err);
    }
  }
  async adopted(req, res, next){

    try {
      const user = req.user;
        const adopted = await Promise.all(
          user.isAdopted.map((CompaniesId) => {
            return usersService.getById(CompaniesId);
          })
        );
        let CompaniesList = [];
        adopted.map((company) => {
          const { _id, name, profilePicture } = company;
          CompaniesList.push({ _id, name, profilePicture });
        });

        const adoptions = await Promise.all(
          user.adoptions.map((studentsId) => {
            return usersService.getById(studentsId);
          })
        );
        let studentsList = [];
        adoptions.map((student) => {
          const { _id, firstname,lastname, profilePicture, domain, searchType } = student;
          studentsList.push({ _id, firstname,lastname, profilePicture, domain , searchType });
        });
        res.status(200).json({adopted : CompaniesList, adoptions: studentsList })

      
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UsersController();
