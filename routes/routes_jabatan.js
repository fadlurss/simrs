var express = require('express')
router = express.Router()
Jabatan = require("../models/Tbl_jabatan")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_jabatan: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const alljabatan = await Jabatan.find({});
    res.render('v_jabatan/index', {
        data_jabatan: alljabatan
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_jabatan/new');
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
        const input_jabatan_baru = await Jabatan.create(result.value);
        res.redirect("/jabatan");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_jabatan = await Jabatan.findById(req.params.id);
    res.render("v_jabatan/edit", {
        jabatan_edit_id: cari_jabatan
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Jabatan.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/jabatan");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_jabatan = await Jabatan.findByIdAndRemove(req.params.id);
    res.redirect("/jabatan");
}))

module.exports = router;