const express = require("express");
const authMiddelware = require("../../middlewares/auth");
const usersController = require("./users.controller");
const router = express.Router();


router.get("/adoptions",authMiddelware, usersController.adoptions);
router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);
router.get("/domain/:domainId", usersController.getByDomain);
router.post("/", usersController.create);
router.put("/:id", authMiddelware ,usersController.update);
router.put("/:id/adopte",authMiddelware, usersController.adopte);
router.put("/:id/unadopte",authMiddelware, usersController.unadopte);
router.delete("/:id",authMiddelware, usersController.delete);

module.exports = router;
