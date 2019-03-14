var express = require('express')
router = express.Router()
Gejala_pakar = require("../models/Tbl_gejala_pakar")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    kode_gejala: Joi.string().required(),
    nama_gejala: Joi.string().required(),
    bobot: Joi.number().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allgejala_pakar = await Gejala_pakar.find({});
    res.render('v_gejalapakar/index', {
        allgejala_pakar: allgejala_pakar
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_gejalapakar/new');
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
        const input_bidang_baru = await Gejala_pakar.create(result.value);
        res.redirect("/gejalapakar");
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