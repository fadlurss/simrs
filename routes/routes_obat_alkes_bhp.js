var express = require('express')
router = express.Router()
Obat = require("../models/Tbl_obat_alkes_bhp")
Kategori = require("../models/Tbl_kategori_barang")
Golongan_obat = require("../models/Tbl_golongan_obat")
Satuan = require("../models/Tbl_satuan_barang")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_barang: Joi.string().required(),
    id_kategori_barang: Joi.string().required(),
    id_satuan_barang: Joi.string().required(),
    id_golongan_obat: Joi.any(),
    harga: Joi.number().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allobat = await Obat.find({}).populate("id_kategori_barang").populate("id_satuan_barang").populate("id_golongan_obat");
    res.render('v_dataobat/index', {
        data_obat: allobat
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_kategori_barang = await Kategori.find({});
    const data_satuan_barang = await Satuan.find({});
    const golongan_obat = await Golongan_obat.find({});
    res.render('v_dataobat/new', {
        data_kategori_barang: data_kategori_barang,
        data_satuan_barang: data_satuan_barang,
        golongan_obat: golongan_obat
    });
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
        const input_dataobat_baru = await Obat.create(result.value);
        res.redirect("/dataobat");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_obat = await Obat.findById(req.params.id).populate("id_kategori_barang").populate("id_satuan_barang").populate("id_golongan_obat");
    const data_kategori_barang = await Kategori.find({});
    const data_satuan_barang = await Satuan.find({});
    const golongan_obat = await Golongan_obat.find({});
    res.render("v_dataobat/edit", {
        obat_edit_id: cari_obat,
        data_kategori_barang: data_kategori_barang,
        data_satuan_barang: data_satuan_barang,
        golongan_obat: golongan_obat
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Obat.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/dataobat");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_dataobat = await Obat.findByIdAndRemove(req.params.id);
    res.redirect("/dataobat");
}))

module.exports = router;