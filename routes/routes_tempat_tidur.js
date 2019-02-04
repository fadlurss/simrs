var express = require('express')
router = express.Router()
Tempat_tidur = require("../models/Tbl_tempat_tidur")
Ruangan = require("../models/Tbl_ruangan")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    kode_ruang_rawat_inap: Joi.string().required(),
    kode_tempat_tidur: Joi.string().required(),
    status: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const alltempat_tidur = await Tempat_tidur.find({}).populate("kode_ruang_rawat_inap");
    res.render('v_tempattidur/index', {
        data_tempattidur: alltempat_tidur
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_ruangan = await Ruangan.find({});
    res.render('v_tempattidur/new', {
        data_ruangan: data_ruangan
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
        const input_tempat_tidur_baru = await Tempat_tidur.create(result.value);
        res.redirect("/tempattidur");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_ruangan = await Ruangan.find({});
    const cari_tempat_tidur = await Tempat_tidur.findById(req.params.id).populate("kode_ruang_rawat_inap");
    res.render("v_tempattidur/edit", {
        tempattidur_edit_id: cari_tempat_tidur,
        data_ruangan: cari_ruangan
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Tempat_tidur.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/tempattidur");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_tempat_tidur = await Tempat_tidur.findByIdAndRemove(req.params.id);
    res.redirect("/tempattidur");
}))

module.exports = router;