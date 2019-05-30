const express = require('express')
router = express.Router()
const pasien = require('../controllers/con_pasien');
middleware = require('../middleware');

router.get('/', middleware.Petugas, pasien.read_pasien);
router.get('/new', middleware.Petugas, pasien.create_pasien);
router.post('/new', middleware.Petugas, pasien.post_pasien);
router.get('/:id/edit', middleware.Petugas, pasien.edit_pasien);
router.put('/:id', middleware.Petugas, pasien.update_pasien);
router.delete('/:id', middleware.Petugas, pasien.delete_pasien);

module.exports = router;