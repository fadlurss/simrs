const express = require('express')
router = express.Router()
const jpd = require('../controllers/con_jpd');
middleware = require('../middleware');

//kenapa middleware.Petugas tidak bisa dipake di controller, hasilnya 404

router.get('/', middleware.Petugas, jpd.read_jpd);
router.get('/new', middleware.Petugas, jpd.create_jpd);
router.post('/new', middleware.Petugas, jpd.post_jpd);
router.get('/:id/edit', middleware.Petugas, jpd.edit_jpd);
router.put('/:id', middleware.Petugas, jpd.update_jpd);
router.delete('/:id', middleware.Petugas, jpd.delete_jpd);

module.exports = router;