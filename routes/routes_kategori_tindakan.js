var express = require('express')
router = express.Router()
Kategori_tindakan = require("../models/Tbl_kategori_tindakan")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    kode_kategori_tindakan: Joi.string().required(),
    kategori_tindakan: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allkategori_tindakan = await Kategori_tindakan.find({});
    res.render('v_kategoritindakan/index', {
        data_kategori_tindakan: allkategori_tindakan
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_kategoritindakan/new');
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
        const input_kategoritindakan = await Kategori_tindakan.create(result.value);
        res.redirect("/kategoritindakan");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_kategoritindakan = await Kategori_tindakan.findById(req.params.id);
    res.render("v_kategoritindakan/edit", {
        kategoritindakan_edit_id: cari_kategoritindakan
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Kategori_tindakan.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/kategoritindakan");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_kategoritindakan = await Kategori_tindakan.findByIdAndRemove(req.params.id);
    res.redirect("/kategoritindakan");
}))

module.exports = router;