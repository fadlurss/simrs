const express = require('express')
router = express.Router()
const jpd = require('../controllers/con_jpd');
middleware = require('../middleware');

//kenapa middleware.Admin tidak bisa dipake di controller, hasilnya 404

router.get('/', middleware.Admin, jpd.read_jpd);
router.get('/new', middleware.Admin, jpd.create_jpd);
router.post('/new', middleware.Admin, jpd.post_jpd);
router.get('/:id/edit', middleware.Admin, jpd.edit_jpd);
router.put('/:id', middleware.Admin, jpd.update_jpd);
router.delete('/:id', middleware.Admin, jpd.delete_jpd);

module.exports = router;