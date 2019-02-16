var express = require('express')
router = express.Router()
Item = require("../models/Tbl_barang")
Kategori_barang = require("../models/Tbl_kategori_barang")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_barang: Joi.string().required(),
    stok: Joi.number().required(),
    stok_minimum: Joi.number().required(),
    harga_modal: Joi.number().required(),
    harga_jual: Joi.number().required(),
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const data_kategori_barang = await Kategori_barang.find({});
    const data_item = await Item.find({}).populate("id_kategori_barang");
    res.render('v_barang/index', {
        data_item: data_item
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_kategori_barang = await Kategori_barang.find({});
    res.render("v_barang/new", {
        data_kategori_barang: data_kategori_barang
    });
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    console.log(req.body);

    const New = await Item.create({ ...req.body
    });
    console.log(New);
    res.redirect("/barang");

}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_barang = await Item.findById(req.params.id).populate("id_kategori_barang");
    const data_kategori_barang = await Kategori_barang.find({})
    res.render("v_barang/edit", {
        data_barang: cari_barang,
        data_kategori_barang: data_kategori_barang
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Item.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/barang");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_barang = await Item.findByIdAndRemove(req.params.id);
    res.redirect("/barang");
}))

module.exports = router;