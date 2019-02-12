var express = require('express')
router = express.Router()
Tindakan = require("../models/Tbl_tindakan")
Kategori_tindakan = require("../models/Tbl_kategori_tindakan")
Poliklinik = require("../models/Tbl_poliklinik")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_tindakan: Joi.string().required(),
    jenis_tindakan: Joi.string().required(),
    kode_kategori_tindakan: Joi.string().required(),
    tarif: Joi.number().required(),
    tindakan_oleh: Joi.string().required(),
    id_poliklinik: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allTindakan = await Tindakan.find({}).populate("id_poliklinik").populate("kode_kategori_tindakan");
    res.render('v_tindakan/index', {
        data_tindakan: allTindakan
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const kategori_tindakan = await Kategori_tindakan.find({});
    const poliklinik = await Poliklinik.find({});
    res.render('v_tindakan/new', {
        kategori_tindakan: kategori_tindakan,
        poliklinik: poliklinik
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
            message: 'Invalid request'
        })
        console.log(error);

    } else {
        const input_Tindakan_baru = await Tindakan.create(result.value);
        res.redirect("/tindakan");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_Tindakan = await Tindakan.findById(req.params.id).populate("kode_kategori_tindakan").populate("id_poliklinik");
    const kategori_tindakan = await Kategori_tindakan.find({});
    const poliklinik = await Poliklinik.find({});
    res.render("v_tindakan/edit", {
        tindakan_edit_id: cari_Tindakan,
        kategori_tindakan: kategori_tindakan,
        poliklinik: poliklinik
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Tindakan.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/tindakan");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_Tindakan = await Tindakan.findByIdAndRemove(req.params.id);
    res.redirect("/tindakan");
}))

module.exports = router;