const express = require('express');
const domainsController = require('./domains.controller');
const router = express.Router();

router.post("/", domainsController.create);
router.get("/", domainsController.getAll);
router.put("/:id", domainsController.update);
router.delete("/:id", domainsController.delete);

module.exports = router;