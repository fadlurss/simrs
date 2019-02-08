var express = require('express')
router = express.Router()
Pemeriksaan_laboratorium = require("../models/Tbl_pemeriksaan_laboratorium")
Sub_pemeriksaan_laboratorium = require("../models/Tbl_sub_pemeriksaan_laboratorium")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    kode_sub_periksa: Joi.string().required(),
    kode_periksa: Joi.string().required(),
    nama_periksa: Joi.any(),
    nama_pemeriksaan: Joi.string().required(),
    satuan: Joi.string().required(),
    nilai_rujukan: Joi.number().required(),
    submit: Joi.any()
})


router.get('/:id', middleware.asyncMiddleware(async (req, res, next) => {
    const all_pemeriksaanlaboratorium = await Pemeriksaan_laboratorium.findById(req.params.id);
    const all_subpemeriksaanlaboratorium = await Sub_pemeriksaan_laboratorium.find({}).populate("kode_periksa");
    res.render('v_subpemeriksaanlaboratorium/index', {
        data_pemeriksaan_laboratorium: all_pemeriksaanlaboratorium,
        data_sub_pemeriksaan_laboratorium: all_subpemeriksaanlaboratorium
    });
}))

router.get('/:id/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_pemeriksaan_laboratorium = await Pemeriksaan_laboratorium.findById(req.params.id);
    res.render('v_subpemeriksaanlaboratorium/new', {
        data_pemeriksaan_laboratorium: data_pemeriksaan_laboratorium
    });
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const a = {
        value,
        error
    } = result;
    const valid = error == null;
    if (!valid) { // jika tidak valid, atau salah...
        res.status(422).json({
            message: 'Invalid request'
        })
        console.log("error 1: " + error);

    } else {
        const kode_periksa = req.body.kode_periksa;
        const input_sub_periksa_labor_baru = await Sub_pemeriksaan_laboratorium.create(result.value);
        res.redirect("/subpemeriksaanlaboratorium/" + kode_periksa);
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_pemeriksaan_laboratorium = await Sub_pemeriksaan_laboratorium.findById(req.params.id).populate("kode_periksa");
    res.render("v_subpemeriksaanlaboratorium/edit", {
        pemeriksaanlaboratorium_edit_id: cari_pemeriksaan_laboratorium
    });
    console.log(cari_pemeriksaan_laboratorium);

}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const kode_periksa = req.body.kode_periksa;
    const hasilUpdate = await Sub_pemeriksaan_laboratorium.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/subpemeriksaanlaboratorium/" + kode_periksa);
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const kode_periksa = req.body.kode_periksa;
    const delete_pemeriksaan_laboratorium = await Sub_pemeriksaan_laboratorium.findByIdAndRemove(req.params.id);
    res.redirect("/subpemeriksaanlaboratorium/" + kode_periksa);
}))


module.exports = router;