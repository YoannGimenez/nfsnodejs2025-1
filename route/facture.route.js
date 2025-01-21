const express = require('express');
const router = express.Router();
const factureController = require('../controller/facture.controller');

router.get('/generate', factureController.generate);

module.exports = router;
