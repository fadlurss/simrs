const express = require('express')
router = express.Router()
const pasien = require('../controllers/con_pasien');
middleware = require('../middleware');

router.get('/', middleware.Admin, pasien.read_pasien);
router.get('/new', middleware.Admin, pasien.create_pasien);
router.post('/new', middleware.Admin, pasien.post_pasien);
router.get('/:id/edit', middleware.Admin, pasien.edit_pasien);
router.put('/:id', middleware.Admin, pasien.update_pasien);
router.delete('/:id', middleware.Admin, pasien.delete_pasien);

module.exports = router;