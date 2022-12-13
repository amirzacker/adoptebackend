const express = require('express');
const searchTypesController = require('./searchTypes.controller');
const router = express.Router();

router.post("/", searchTypesController.create);
router.get("/", searchTypesController.getAll);
router.put("/:id", searchTypesController.update);
router.delete("/:id", searchTypesController.delete);

module.exports = router;