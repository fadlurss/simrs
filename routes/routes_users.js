const express = require('express')
router = express.Router()
const users = require('../controllers/con_users');
middleware = require('../middleware');

router.get('/', users.redirect_halaman_awal);
router.get('/index', users.halaman_awal);
router.get('/pelayanan', users.pelayanan);
router.get('/jadwaldokter', users.jadwal_dokter);
router.get('/hubungikami', users.hubungi_kami);
router.get("/users/:id", middleware.isLoggedIn, users.get_user);
router.get('/logout', users.logout);
router.get('/login', users.login);
router.post('/login', users.post_login);
router.get('/loginpetugas', users.login_petugas);
router.post('/loginpetugas', users.post_login_petugas);
router.get('/jadwaldokter', users.jadwal_dokter);
router.get('/signup', users.signup);
router.post('/signup', users.post_signup);
router.get("/verify", users.verify);
router.get('/verify/:tokenReg', users.post_verify);


module.exports = router;