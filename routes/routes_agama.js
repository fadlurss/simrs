var express = require('express')
router = express.Router()
Agama = require("../models/Tbl_agama")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_agama: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allagama = await Agama.find({});
    res.render('v_agama/index', {
        allagama: allagama
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_agama/new');
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
        const input_jabatan_baru = await Agama.create(result.value);
        res.redirect("/agama");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_jabatan = await Agama.findById(req.params.id);
    res.render("v_agama/edit", {
        jabatan_edit_id: cari_jabatan
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema);
    const hasilUpdate = await Jabatan.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            ...req.body
        }
    });
    res.redirect("/jabatan");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_jabatan = await Jabatan.findByIdAndRemove(req.params.id);
    res.redirect("/jabatan");
}))

module.exports = router;