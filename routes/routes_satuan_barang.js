var express = require('express')
router = express.Router()
Satuan_barang = require("../models/Tbl_satuan_barang")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_satuan: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allsatuan_barang = await Satuan_barang.find({});
    res.render('v_satuanbarang/index', {
        data_satuan_barang: allsatuan_barang
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_satuanbarang/new');
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
        const input_bidang_baru = await Satuan_barang.create(result.value);
        res.redirect("/satuanbarang");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_satuan_barang = await Satuan_barang.findById(req.params.id);
    res.render("v_satuanbarang/edit", {
        satuan_barang_edit_id: cari_satuan_barang
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Satuan_barang.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/satuanbarang");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_satuan_barang = await Satuan_barang.findByIdAndRemove(req.params.id);
    res.redirect("/satuanbarang");
}))

module.exports = router;