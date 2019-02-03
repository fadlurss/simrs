var express = require('express')
router = express.Router()
Gedung = require("../models/Tbl_gedung")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_gedung: Joi.string().required(),
    kode_gedung_rawat_inap: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allgedung = await Gedung.find({});
    res.render('v_gedung/index', {
        data_gedung: allgedung
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_gedung/new');
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
        const input_gedung_baru = await Gedung.create(result.value);
        res.redirect("/gedung");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_gedung = await Gedung.findById(req.params.id);
    res.render("v_gedung/edit", {
        gedung_edit_id: cari_gedung
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Gedung.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/gedung");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_gedung = await Gedung.findByIdAndRemove(req.params.id);
    res.redirect("/gedung");
}))

module.exports = router;