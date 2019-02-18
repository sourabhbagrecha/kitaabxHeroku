const express = require('express');
const router = express.Router();

const mainController = require('../controllers/api-main');

router.get('/get/subjects', mainController.getSubjects);
router.get('/search', mainController.searchSubject);
router.post('/get/materials', mainController.getMaterials);

module.exports = router;