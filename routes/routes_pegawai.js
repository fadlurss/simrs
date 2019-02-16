var express = require('express')
router = express.Router()
Jenjang_pendidikan = require("../models/Tbl_jenjang_pendidikan")
Pegawai = require("../models/Tbl_pegawai")
Jabatan = require("../models/Tbl_jabatan")
Agama = require("../models/Tbl_agama")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nip: Joi.number().required(),
    nama_pegawai: Joi.string().required(),
    jenis_kelamin: Joi.any().valid('Laki-laki', 'Perempuan'),
    npwp: Joi.number().required(),
    jenjang_pendidikan: Joi.string().required(),
    tempat_lahir: Joi.string().required(),
    tanggal_lahir: Joi.string().required(),
    jabatan: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const data_pegawai = await Pegawai.find({}).populate("jenjang_pendidikan").populate("jabatan");
    res.render('v_pegawai/index', {
        data_pegawai: data_pegawai
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_jenjang_pendidikan = await Jenjang_pendidikan.find({});
    const data_jabatan = await Jabatan.find({});
    res.render("v_pegawai/new", {
        data_jenjang_pendidikan: data_jenjang_pendidikan,
        data_jabatan: data_jabatan
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
        const input_pegawai_baru = await Pegawai.create(result.value);
        res.redirect("/pegawai");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const data_pegawai = await Pegawai.findById(req.params.id);
    const data_jenjang_pendidikan = await Jenjang_pendidikan.find({});
    const data_jabatan = await Jabatan.find({});
    res.render("v_pegawai/edit", {
        data_pegawai: data_pegawai,
        data_jenjang_pendidikan: data_jenjang_pendidikan,
        data_jabatan: data_jabatan
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Pegawai.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/pegawai");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_pegawai = await Pegawai.findByIdAndRemove(req.params.id);
    res.redirect("/pegawai");
}))

module.exports = router;