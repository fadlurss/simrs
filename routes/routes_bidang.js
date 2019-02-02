var express = require('express')
router = express.Router()
Bidang = require("../models/Tbl_bidang")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_bidang: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allbidang = await Bidang.find({});
    res.render('v_bidang/index', {
        data_bidang: allbidang
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_bidang/new');
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
        const input_bidang_baru = await Bidang.create(result.value);
        res.redirect("/bidang");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_bidang = await Bidang.findById(req.params.id);
    res.render("v_bidang/edit", {
        bidang_edit_id: cari_bidang
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Bidang.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/bidang");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_bidang = await Bidang.findByIdAndRemove(req.params.id);
    res.redirect("/bidang");
}))

module.exports = router;