var express = require('express')
router = express.Router()
Pasien = require("../models/Tbl_pasien")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    no_rm: Joi.number(),
    no_rm_lama: Joi.number(),
    nama_pasien: Joi.string().required(),
    awal_berobat: Joi.date().required(),
    tanggal_lahir: Joi.date().required(),
    umur: Joi.number().required(),
    alamat: Joi.string().required(),
    pekerjaan: Joi.string().required(),
    no_hp: Joi.number().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allpasien = await Pasien.find({});
    res.render('v_pasien/index', {
        data_pasien: allpasien
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_pasien/new');
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
        const input_pasien_baru = await Pasien.create(result.value);
        res.redirect("/pasien");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_pasien = await Pasien.findById(req.params.id);
    res.render("v_pasien/edit", {
        data_pasien: cari_pasien
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
    res.redirect("/pasien");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_pasien = await Pasien.findByIdAndRemove(req.params.id);
    res.redirect("/pasien");
}))

module.exports = router;