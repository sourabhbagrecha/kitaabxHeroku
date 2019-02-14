const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main');

router.get('/', mainController.getHome);
router.get('/subjects',mainController.getSubjects);
router.get('/subject/:id',mainController.getSubject);

router.get('/material/:id', mainController.getMaterial);

// router.get('/error', mainController.getError);
module.exports = router;