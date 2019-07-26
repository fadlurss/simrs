const express = require('express')
router = express.Router()
const pendaftaran = require('../controllers/con_pendaftaran');
middleware = require('../middleware');
flash = require('connect-flash');

router.get('/', middleware.DokterdanAdmin, pendaftaran.read)
router.get('/new', middleware.Admin, pendaftaran.create)
router.post('/new', middleware.Admin, pendaftaran.post)
router.get('/hasil_laporan', middleware.Admin, pendaftaran.hasil_laporan)
router.get('/hasil_laporan_gen', middleware.Admin, pendaftaran.hasil_laporan_gen)
router.post('/hasil_laporan_bulanan', middleware.Admin, pendaftaran.hasil_laporan_bulanan)
router.post('/hasil_laporan_tahunan', middleware.Admin, pendaftaran.hasil_laporan_tahunan)
router.get('/daftar', pendaftaran.create_daftarantrian) // daftar antrian online
router.post('/daftar', pendaftaran.post_daftarantrian)
router.post('/:id/new_riwayattindakan', middleware.Dokter, pendaftaran.post_riwayat_tindakan)
router.post('/:id/new_riwayatdiagnosa', middleware.Dokter, pendaftaran.post_riwayat_diagnosa)
router.post('/:id/new_riwayatobat', middleware.Dokter, pendaftaran.post_riwayat_obat)
router.get("/:id/detail", middleware.DokterdanAdmin, pendaftaran.detail)
router.get("/:id/cetak", middleware.Dokter, pendaftaran.cetak)
router.get("/:id/edit", middleware.Admin, pendaftaran.edit)
router.put("/:id", middleware.Admin, pendaftaran.update)
router.delete("/:id", middleware.Admin, pendaftaran.delete)
router.get('/contoh', pendaftaran.contoh);
router.get('/cariibu/:id', pendaftaran.cari_ibu);
router.post('/cariobat', pendaftaran.cariobat);
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