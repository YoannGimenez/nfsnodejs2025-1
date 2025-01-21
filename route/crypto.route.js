const express = require('express');
const router = express.Router();
const cryptoController = require('../controller/crypto.controller');

router.get('/getAll', cryptoController.findAll);

router.post('/postArticle', cryptoController.create);

module.exports = router;