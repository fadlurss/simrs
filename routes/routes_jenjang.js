var express = require('express')
router = express.Router()
Jenjang = require("../models/Tbl_jenjang")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_jenjang: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allJenjang = await Jenjang.find({});
    res.render('v_jenjang/index', {
        data_jenjang: allJenjang
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_jenjang/new');
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
        const input_jenjang_baru = await Jenjang.create(result.value);
        res.redirect("/jenjang");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_jenjang = await Jenjang.findById(req.params.id);
    res.render("v_jenjang/edit", {
        jenjang_edit_id: cari_jenjang
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Jenjang.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/jenjang");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_jenjang = await Jenjang.findByIdAndRemove(req.params.id);
    res.redirect("/jenjang");
}))

module.exports = router;