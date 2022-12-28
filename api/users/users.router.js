const express = require("express");
const authMiddelware = require("../../middlewares/auth");
const usersController = require("./users.controller");
const router = express.Router();


router.get("/adoptions",authMiddelware, usersController.adopted);
router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);
router.put("/:id/adopte",authMiddelware, usersController.adopte);
router.get("/email/:email", usersController.getByEmail);
router.get("/domain/:domainId", usersController.getByDomain);
router.post("/", usersController.create);
router.put("/:id", authMiddelware ,usersController.update);
router.put("/:id/unadopte",authMiddelware, usersController.unadopte);
router.delete("/:id",authMiddelware, usersController.delete);

module.exports = router;
