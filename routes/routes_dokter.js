var express = require('express')
router = express.Router()
const dokter = require('../controllers/con_dokter');
middleware = require('../middleware');

router.get('/', middleware.Admin, dokter.read_dokter)
router.get('/new', middleware.Admin, dokter.create_dokter)
router.post('/new', middleware.Admin, dokter.post_dokter)
router.get("/:id/edit", middleware.Admin, dokter.edit_dokter)
router.put("/:id", middleware.Admin, dokter.update_dokter)
router.delete("/:id", middleware.Admin, dokter.delete_dokter)

module.exports = router;