var express = require('express')
router = express.Router()
Departemen = require("../models/Tbl_departemen")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_departemen: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const alldepartemen = await Departemen.find({});
    res.render('v_departemen/index', {
        data_departemen: alldepartemen
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_departemen/new');
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
        const input_departemen_baru = await Departemen.create(result.value);
        res.redirect("/departemen");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_departemen = await Departemen.findById(req.params.id);
    res.render("v_departemen/edit", {
        departemen_edit_id: cari_departemen
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Departemen.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/departemen");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_departemen = await Departemen.findByIdAndRemove(req.params.id);
    res.redirect("/departemen");
}))

module.exports = router;