var express = require('express')
router = express.Router()
Jpd = require("../models/Tbl_jadwal_praktek_dokter") // Jpd = jadwal praktek dokter
Dokter = require("../models/Tbl_dokter")
Poliklinik = require("../models/Tbl_poliklinik")
Agama = require("../models/Tbl_agama")
Status_menikah = require("../models/Tbl_status_menikah")
Spesialis = require("../models/Tbl_spesialis")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_dokter: Joi.string().required(),
    jenis_kelamin: Joi.any().valid('Laki-laki', 'Perempuan'),
    tempat_lahir: Joi.string().required(),
    tanggal_lahir: Joi.string().required(),
    agama: Joi.string().required(),
    alamat: Joi.string().required(),
    no_hp: Joi.number().min(11).required().integer(),
    golongan_darah: Joi.any().valid('O', 'A', 'B', 'AB'),
    status_menikah: Joi.string().required(),
    spesialis: Joi.string().required(),
    alumni: Joi.string().required(),
    no_izin_praktek: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const data_spesialis = await Spesialis.find({});
    const data_dokter = await Dokter.find({}).populate("agama").populate("status_menikah").populate("spesialis");
    res.render('v_dokter/index', {
        data_dokter: data_dokter,
        data_spesialis: data_spesialis
    });
    console.log(data_dokter);

}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_agama = await Agama.find({});
    const data_status_menikah = await Status_menikah.find({});
    const data_spesialis = await Spesialis.find({});
    res.render("v_dokter/new", {
        data_agama: data_agama,
        data_status_menikah: data_status_menikah,
        data_spesialis: data_spesialis
    });
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    console.log(result.error);
    const {
        value,
        error
    } = result;
    const valid = error == null;
    if (!valid) {
        res.status(422).json({
            message: 'Invalide request',
            data: result
        })
    } else {
        const input_dokter_baru = await Dokter.create(result.value);
        res.redirect("/dokter");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_dokter = await Dokter.findById(req.params.id);
    const data_agama = await Agama.find({});
    const data_status_menikah = await Status_menikah.find({});
    const data_spesialis = await Spesialis.find({});
    res.render("v_dokter/edit", {
        dokter_edit_id: cari_dokter,
        data_agama: data_agama,
        data_spesialis: data_spesialis,
        data_status_menikah: data_status_menikah
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Dokter.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/dokter");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_dokter = await Dokter.findByIdAndRemove(req.params.id);
    res.redirect("/dokter");
}))

module.exports = router;