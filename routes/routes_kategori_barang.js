var express = require('express')
router = express.Router()
Kategori_barang = require("../models/Tbl_kategori_barang")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_kategori: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allkategoribarang = await Kategori_barang.find({});
    res.render('v_kategoribarang/index', {
        data_kategori_barang: allkategoribarang
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_kategoribarang/new');
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
        const input_kategori_baru = await Kategori_barang.create(result.value);
        res.redirect("/kategoribarang");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_kategori_barang = await Kategori_barang.findById(req.params.id);
    res.render("v_kategoribarang/edit", {
        kategori_barang_edit_id: cari_kategori_barang
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Kategori_barang.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/kategoribarang");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_kategori_barang = await Kategori_barang.findByIdAndRemove(req.params.id);
    res.redirect("/kategoribarang");
}))

module.exports = router;