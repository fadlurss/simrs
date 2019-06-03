const express = require('express')
router = express.Router()
const pegawai = require('../controllers/con_pegawai');
middleware = require('../middleware');

router.get('/', pegawai.read_pegawai)
router.get('/new', pegawai.create_pegawai)
router.post('/new', pegawai.post_pegawai)
router.get('/:id/edit', pegawai.edit_pegawai)
router.put('/:id', pegawai.update_pegawai)
router.delete('/:id', middleware.Petugas, pegawai.delete_pegawai)

module.exports = router;