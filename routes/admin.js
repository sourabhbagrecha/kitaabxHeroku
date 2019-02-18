const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/dashboard', adminController.getDashboard);
router.get('/manage/:id', adminController.getManageMaterial);
router.post('/manage/:id', adminController.postManageMaterial);

module.exports = router;