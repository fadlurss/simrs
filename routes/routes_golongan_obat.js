var express = require('express')
router = express.Router()
Golongan_obat = require("../models/Tbl_golongan_obat")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_golongan_obat: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allGolongan_obat = await Golongan_obat.find({});
    res.render('v_golonganobat/index', {
        data_golongan_obat: allGolongan_obat
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_golonganobat/new');
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
        const input_Golongan_obat_baru = await Golongan_obat.create(result.value);
        res.redirect("/golonganobat");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_Golongan_obat = await Golongan_obat.findById(req.params.id);
    res.render("v_golonganobat/edit", {
        golongan_obat_edit_id: cari_Golongan_obat
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Golongan_obat.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/golonganobat");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_Golongan_obat = await Golongan_obat.findByIdAndRemove(req.params.id);
    res.redirect("/golonganobat");
}))

module.exports = router;