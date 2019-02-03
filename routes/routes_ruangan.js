var express = require('express')
router = express.Router()
Gedung = require("../models/Tbl_gedung")
Ruangan = require("../models/Tbl_ruangan")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    kode_ruang_rawat_inap: Joi.string().required(),
    kode_gedung_rawat_inap: Joi.string().required(),
    nama_ruangan: Joi.string().required(),
    kelas: Joi.string().required(),
    tarif: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allruangan = await Ruangan.find({}).populate("kode_gedung_rawat_inap");
    res.render('v_ruangan/index', {
        data_ruangan: allruangan
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_gedung = await Gedung.find({});
    res.render('v_ruangan/new', {
        data_gedung: data_gedung
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
    } else {
        const input_ruangan_baru = await Ruangan.create(result.value);
        res.redirect("/ruangan");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_gedung = await Gedung.find({});
    const cari_ruangan = await Ruangan.findById(req.params.id).populate("kode_gedung_rawat_inap");
    res.render("v_ruangan/edit", {
        ruangan_edit_id: cari_ruangan,
        data_gedung: cari_gedung
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Ruangan.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/ruangan");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_ruangan = await Ruangan.findByIdAndRemove(req.params.id);
    res.redirect("/ruangan");
}))

module.exports = router;