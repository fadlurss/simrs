const express = require('express')
router = express.Router()
const pendaftaran = require('../controllers/con_pendaftaran');
middleware = require('../middleware');

router.get('/', middleware.DokterdanPetugas, pendaftaran.read)
router.get('/new', middleware.Petugas, pendaftaran.create)
router.post('/new', middleware.Petugas, pendaftaran.post)
router.get('/daftar', pendaftaran.create_daftarantrian) // daftar antrian online
router.post('/daftar', pendaftaran.post_daftarantrian)
router.post('/:id/new_riwayattindakan', middleware.Dokter, pendaftaran.post_riwayat_tindakan)
router.post('/:id/new_riwayatdiagnosa', middleware.Dokter, pendaftaran.post_riwayat_diagnosa)
router.get("/:id/detail", middleware.DokterdanPetugas, pendaftaran.detail)
router.get("/:id/cetak", middleware.Dokter, pendaftaran.cetak)
router.get("/:id/edit", middleware.Petugas, pendaftaran.edit)
router.put("/:id", middleware.Petugas, pendaftaran.update)
router.delete("/:id", middleware.Petugas, pendaftaran.delete)
router.get('/contoh', pendaftaran.contoh);
router.post('/cariibu', pendaftaran.cari_ibu);
router.post('/tindakan_oleh', pendaftaran.tindakan_oleh);
router.get('/cari_dokter', pendaftaran.cari_dokter);
router.get('/cari_pegawai', pendaftaran.cari_pegawai);
router.get('/cari_tindakan', pendaftaran.cari_tindakan);
router.get('/cari_obat', pendaftaran.cari_obat);
router.post('/cari_id_dokter', pendaftaran.cari_id_dokter);
router.post('/cari_id_pegawai', pendaftaran.cari_id_pegawai);
router.post('/cari_id_tindakan', pendaftaran.cari_id_tindakan);
router.post('/cari_id_obat', pendaftaran.cari_id_obat);

module.exports = router;