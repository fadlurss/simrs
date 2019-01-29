var express = require('express')
router = express.Router()
Poliklinik = require("../models/Tbl_poliklinik")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_poliklinik: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allPoliklinik = await Poliklinik.find({});
    res.render('v_poliklinik/index', {
        data_poliklinik: allPoliklinik
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_poliklinik/new');
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    console.log(result.error); //melihat hasil result dari validasi library joi
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
        const input_poliklinik_baru = await Poliklinik.create(result.value);
        res.redirect("/poliklinik");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_poliklinik = await Poliklinik.findById(req.params.id);
    res.render("v_poliklinik/edit", {
        poliklinik_edit_id: cari_poliklinik
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Poliklinik.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/poliklinik");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_poliklinik = await Poliklinik.findByIdAndRemove(req.params.id);
    res.redirect("/poliklinik");
}))

module.exports = router;