var express = require('express')
router = express.Router()
Diagnosa_pakar = require("../models/Tbl_diagnosa_pakar")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    kode_diagnosa: Joi.string().required(),
    nama_diagnosa: Joi.string().required(),
    keterangan: Joi.any(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const alldiagnosa_pakar = await Diagnosa_pakar.find({});
    res.render('v_diagnosapakar/index', {
        alldiagnosa_pakar: alldiagnosa_pakar
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_diagnosapakar/new');
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
        const input_bidang_baru = await Diagnosa_pakar.create(result.value);
        res.redirect("/diagnosapakar");
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