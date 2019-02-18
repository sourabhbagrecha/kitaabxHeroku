const express = require('express');
const router = express.Router();

const mainRoutes = require('./main');
const authRoutes = require('./auth');
const publisherRoutes = require('./publisher');
const adminRoutes = require('./admin');
const apiMain = require('./api-main');


router.use(mainRoutes);
router.use('/auth', authRoutes);
router.use('/publisher', publisherRoutes);
router.use('/admin', adminRoutes);
router.use('/api/main', apiMain);

module.exports = router;