const express = require('express')
router = express.Router()
const notifikasi = require('../controllers/con_notifikasi');
middleware = require('../middleware');

router.get('/', notifikasi.notifications)
router.get("/:id", notifikasi.detail_notifikasi)

module.exports = router;