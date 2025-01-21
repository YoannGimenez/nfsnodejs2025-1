const express = require('express');
const router = express.Router();
const articleController = require('../controller/article.controller');

router.get('/getAll', articleController.findAll);

router.post('/postArticle', articleController.postArticle);

module.exports = router;