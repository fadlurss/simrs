var express = require('express')
router = express.Router()
Pasien = require("../models/Tbl_pasien")
Pendaftaran = require("../models/Tbl_pendaftaran")
Jenis_bayar = require("../models/Tbl_jenis_bayar")
Dokter = require("../models/Tbl_dokter")
Poliklinik = require("../models/Tbl_poliklinik")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    no_registrasi: Joi.number().required(),
    no_rawat: Joi.string(),
    no_rm: Joi.string(),
    cara_masuk: Joi.string().required(),
    tgl_daftar: Joi.date().required(),
    id_pasien: Joi.string().required(),
    id_dokter_penanggung_jawab: Joi.string().required(),
    nama_dokter: Joi.any(),
    id_poliklinik: Joi.string().required(),
    id_jenis_bayar: Joi.string().required(),
    nama_pasien: Joi.string(),
    no_bpjs: Joi.number().required(),
    tanggal_lahir: Joi.date().required(),
    nama_penanggung_jawab: Joi.string().required(),
    hubungan_penanggung_jawab: Joi.string().required(),
    alamat_penanggung_jawab: Joi.string().required(),
    no_bpjs: Joi.number().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allpendaftaran = await Pendaftaran.find({}).populate("id_pasien").populate("id_dokter_penanggung_jawab").populate("id_jenis_bayar").populate("id_poliklinik");
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
    const result = Joi.validate({ ...req.body
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
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const data_agama = await Agama.find({});
    const data_status_menikah = await Status_menikah.find({});
    const cari_pasien = await Pasien.findById(req.params.id).populate("agama").populate("status_menikah");
    res.render("v_pasien/edit", {
        data_pasien: cari_pasien,
        data_agama: data_agama,
        data_status_menikah: data_status_menikah
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Pasien.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
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

router.get('/cari_dokter', (req, res) => {
    Dokter.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_dokter;
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

module.exports = router;