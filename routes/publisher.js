const express = require('express');
const router = express.Router();
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

const isPublisher = require('../middleware/is-publisher');
const checkO = require('../middleware/check-ownership');
const pController = require('../controllers/publisher');
const awsController = require('../trash/aws-upload');
const isAuth = require('../middleware/is-auth');

router.get('/dashboard', isPublisher, pController.getDashboard);
router.get('/createMaterial', isPublisher, pController.getCreateMaterialPage);
router.post('/createMaterial/step1', isPublisher, pController.postStep1);
router.post('/createMaterial/step2', isPublisher, pController.postStep2);
router.get('/createMaterial/:id/uploadpdf', isPublisher, checkO, pController.getStep2);
// router.post('/createMaterial/:id/uploadpdf',pController.postPdfUpload);
router.post('/createMaterial/:id/uploadpdf', multipartyMiddleware, awsController.multiparting);
router.get('/signup', isAuth, pController.getSignup);
router.post('/signup', isAuth, pController.postSignup);

module.exports = router;