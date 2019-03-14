var express = require('express')
router = express.Router()
Gejala_pakar = require("../models/Tbl_gejala_pakar")
Diagnosa_pakar = require("../models/Tbl_diagnosa_pakar")
Relasi_pakar = require("../models/Tbl_relasi_pakar")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    kode_relasi_pakar: Joi.string().required(),
    kode_gejala_pakar: Joi.string().required(),
    kode_diagnosa_pakar: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allrelasi_pakar = await Relasi_pakar.find({}).populate("id_gejala_pakar").populate("id_diagnosa_pakar");

    res.render('v_relasipakar/index', {
        allrelasi_pakar: allrelasi_pakar
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_gejala = await Gejala_pakar.find({});
    const data_diagnosa = await Diagnosa_pakar.find({});
    res.render('v_relasipakar/new', {
        data_gejala: data_gejala,
        data_diagnosa: data_diagnosa
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
            message: 'Invalid request'
        })
    } else {
        const input_bidang_baru = await Relasi_pakar.create(result.value);
        res.redirect("/relasipakar");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_diagnosapenyakit = await Diagnosa_penyakit.findById(req.params.id);
    res.render("v_diagnosapenyakit/edit", {
        diagnosapenyakit_edit_id: cari_diagnosapenyakit
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema);
    const hasilUpdate = await Diagnosa_penyakit.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            ...req.body
        }
    });
    res.redirect("/diagnosapenyakit");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_diagnosapenyakit = await Diagnosa_penyakit.findByIdAndRemove(req.params.id);
    res.redirect("/diagnosapenyakit");
}))

module.exports = router;