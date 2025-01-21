const express = require('express');
const router = express.Router();
const presentationController = require('../controller/presentation.controller');

router.get('getAll', presentationController.findAll);

router.post('postPresentation', presentationController.postPresentation);

router.put('putPresentation/{id}', presentationController.putPresentation);

module.exports = router;