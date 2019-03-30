var express = require('express')
router = express.Router()
Pasien = require("../models/Tbl_pasien")
Pendaftaran = require("../models/Tbl_pendaftaran")
Tindakan = require("../models/Tbl_tindakan")
Obat = require("../models/Tbl_obat_alkes_bhp")
Jenis_bayar = require("../models/Tbl_jenis_bayar")
Dokter = require("../models/Tbl_dokter")
Pegawai = require("../models/Tbl_pegawai")
Poliklinik = require("../models/Tbl_poliklinik")
Riwayattindakan = require("../models/Tbl_riwayattindakan")
PJRiwayattindakan = require("../models/Tbl_pj_riwayattindakan")
Riwayatberiobat = require("../models/Tbl_riwayatberiobat")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");
var moment = require('moment');
var now = moment().toDate();

const schema = Joi.object().keys({
    no_registrasi: Joi.number().required(),
    no_rawat: Joi.string(),
    no_rm: Joi.string(),
    tgl_daftar: Joi.date().required(),
    id_pasien: Joi.string().required(),
    id_dokter_penanggung_jawab: Joi.string().required(),
    nama_dokter: Joi.any(),
    id_poliklinik: Joi.string().required(),
    nama_pasien: Joi.string(),
    tanggal_lahir: Joi.date().required(),
    nama_penanggung_jawab: Joi.string().required(),
    hubungan_penanggung_jawab: Joi.string().required(),
    alamat_penanggung_jawab: Joi.string().required(),
    tanggal_sekarang: Joi.any(),
    submit: Joi.any()
})

const schema2 = Joi.object().keys({
    kode_pj: Joi.any(),
    id_pendaftaran: Joi.string().required(),
    id_dokter: Joi.any(),
    id_dokter2: Joi.any(),
    id_pegawai: Joi.any(),
    id_petugas: Joi.any(),
    id_pegawai2: Joi.any(),
    nama_dokter: Joi.any(),
    nama_dokter2: Joi.any(),
    nama_pegawai: Joi.any(),
    nama_pegawai2: Joi.any(),
    nama_tindakan: Joi.any(),
    dilakukan_oleh: Joi.any(),
    nama_petugas: Joi.any(),
    id_tindakan: Joi.string().required(),
    no_rawat: Joi.any(),
    hasil_periksa: Joi.string().required(),
    perkembangan: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allpendaftaran = await Pendaftaran.find({})
        .sort({
            createdAt: -1
        })
        .populate("id_pasien")
        .populate("id_dokter_penanggung_jawab")
        .populate("id_jenis_bayar")
        .populate("id_poliklinik");
    res.render('v_pendaftaran/index', {
        data_pendaftaran: allpendaftaran
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_dokter = await Dokter.find({});
    const data_jenis_bayar = await Jenis_bayar.find({});
    const data_pasien = await Pasien.find({});
    const data_poli = await Poliklinik.find({});

    res.render('v_pendaftaran/new', {
        data_dokter: data_dokter,
        data_jenis_bayar: data_jenis_bayar,
        data_pasien: data_pasien,
        data_poliklinik: data_poli
    });
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema);
    const {
        value,
        error
    } = result;
    const valid = error == null;
    if (!valid) { // jika tidak valid, atau salah...
        res.status(422).json({
            message: 'Invalid request',
            data: 'error'
        })
        console.log(error);

    } else {
        const result = Joi.validate({
            ...req.body
        }, schema);
        const {
            value,
            error
        } = result;
        const valid = error == null;
        if (!valid) { // jika tidak valid, atau salah...
            res.status(422).json({
                message: 'Invalid request',
                data: 'error'
            })
            console.log(error);

        } else {

            const input_pendaftaran_baru = await Pendaftaran.create(result.value);
            res.redirect("/pendaftaran");
        }
    }
}))

router.post('/:id/new_riwayattindakan', middleware.asyncMiddleware(async (req, res, next) => {
    Pendaftaran.findById(req.params.id, async (err, hasil_pendaftaran) => {
        const newR = await Riwayattindakan.create(req.body);
        hasil_pendaftaran.id_riwayattindakan.push(newR);
        hasil_pendaftaran.save();
        const id_riwayat_tindakan = newR.id;
        const id_dokter = req.body.id_dokter;
        const id_petugas = req.body.id_petugas;
        const keterangan = req.body.dilakukan_oleh;
        const new_pj_riwayat_tindakan = {
            id_riwayat_tindakan: id_riwayat_tindakan,
            id_dokter: id_dokter,
            id_pegawai: id_petugas,
            keterangan: keterangan
        }
        const input_pj_riwayat_tindakan = await PJRiwayattindakan.create(new_pj_riwayat_tindakan);
        res.redirect("/pendaftaran/" + req.params.id + "/detail");
    });
}))

router.post('/:id/new_riwayatberiobat', middleware.asyncMiddleware(async (req, res, next) => {
    Pendaftaran.findById(req.params.id, async (err, hasil_pendaftaran) => {
        const newR = await Riwayatberiobat.create(req.body);
        hasil_pendaftaran.id_riwayatberiobat.push(newR);
        hasil_pendaftaran.save();
        res.redirect("/pendaftaran/" + req.params.id + "/detail");
    });
}))


router.get("/:id/detail", middleware.asyncMiddleware(async (req, res, next) => {
    const data_pendaftaran = await Pendaftaran.findById(req.params.id)
        .populate("id_pasien")
        .populate({
            path: "id_riwayatberiobat",
            populate: {
                path: "id_obat"
            }
        })
        .populate({
            path: "id_riwayattindakan",
            populate: {
                path: "id_tindakan"
            }
        });
    total = 0;
    subtotal = 0;

    data_pendaftaran.id_riwayattindakan.forEach(function (comment) {
        total = total + comment.id_tindakan.tarif;
    });

    data_pendaftaran.id_riwayatberiobat.forEach(function (comment) {
        subtotal = subtotal + (comment.qty * comment.id_obat.harga);
    });

    res.render("v_pendaftaran/detail", {
        data_pendaftaran: data_pendaftaran,
        total: total,
        subtotal: subtotal
    });
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const data_poliklinik = await Poliklinik.find({});
    const data_jenis_bayar = await Jenis_bayar.find({});
    const data_pendaftaran = await Pendaftaran.findById(req.params.id)
        .populate("id_pasien")
        .populate("id_dokter_penanggung_jawab")
        .populate({
            path: "id_riwayatberiobat",
            populate: {
                path: "id_obat"
            }
        })
        .populate({
            path: "id_riwayattindakan",
            populate: {
                path: "id_tindakan"
            }
        });
    res.render("v_pendaftaran/edit", {
        data_pendaftaran: data_pendaftaran,
        data_poliklinik: data_poliklinik,
        data_jenis_bayar: data_jenis_bayar
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema);
    const hasilUpdate = await Pendaftaran.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            ...req.body
        }
    });
    res.redirect("/pendaftaran");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_pendaftaran = await Pendaftaran.findByIdAndRemove(req.params.id);
    res.redirect("/pendaftaran");
}))

router.get('/contoh', (req, res) => {
    Pasien.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].no_rm;
        }
        res.json(d);
    });
});

router.post('/cariibu', (req, res) => {
    //    console.log(req.body.np);
    Pasien.find({
        'no_rm': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.post('/tindakan_oleh', (req, res) => {
    //    console.log(req.body.np);
    Pasien.find({
        'no_rm': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.get('/cari_dokter', (req, res) => {
    Dokter.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_dokter;
        }
        res.json(d);
    });
});

router.get('/cari_pegawai', (req, res) => {
    Pegawai.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_pegawai;
        }
        res.json(d);
    });
});

router.get('/cari_tindakan', (req, res) => {
    Tindakan.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_tindakan;
        }
        res.json(d);
    });
});

router.get('/cari_obat', (req, res) => {
    Obat.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_barang;
        }
        res.json(d);
    });
});

router.post('/cari_id_dokter', (req, res) => {
    //    console.log(req.body.np);
    Dokter.find({
        'nama_dokter': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.post('/cari_id_pegawai', (req, res) => {
    //    console.log(req.body.np);
    Pegawai.find({
        'nama_pegawai': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.post('/cari_id_tindakan', (req, res) => {
    //    console.log(req.body.np);
    Tindakan.find({
        'nama_tindakan': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.post('/cari_id_obat', (req, res) => {
    //    console.log(req.body.np);
    Obat.find({
        'nama_barang': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});


module.exports = router;