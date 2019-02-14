var express = require('express')
router = express.Router()
Pengadaanobat = require("../models/Tbl_pengadaanobat")
Pengadaanobat_detail = require("../models/Tbl_pengadaanobat_detail")
Barang = require("../models/Tbl_obat_alkes_bhp")
Supplier = require("../models/Tbl_supplier")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    no_faktur: Joi.number().required(),
    tanggal: Joi.string().required(),
    id_supplier: Joi.string().required(),
    nama_supplier: Joi.any(),
    nama_barang: Joi.any(),
    harga: Joi.number().required(),
    qty: Joi.string().required(),
    submit: Joi.any(),
    id_barang: Joi.string().required(),
    id_pengadaanobat: Joi.any()
})


router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allPengadaanobat = await Pengadaanobat.find({}).populate("id_supplier");
    res.render('v_pengadaanobat/index', {
        data_pengadaanobat: allPengadaanobat
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_supplier = await Supplier.find({});
    res.render('v_Pengadaanobat/new', {
        data_supplier: data_supplier
    });
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);


    console.log("hasil result 1 " + schema);
    const a = {
        value,
        error
    } = result;
    const valid = error == null;
    if (!valid) { // jika tidak valid, atau salah...
        res.status(422).json({
            message: 'Invalid request'
        })
        console.log("error 1: " + error);

    } else {
        const input_Pengadaanobat_baru = await Pengadaanobat.create(result.value);

        const id_pengadaanobat = input_Pengadaanobat_baru._id;
        const id_barang = req.body.id_barang;
        const qty = req.body.qty;
        const new_pengadaan_detail = {
            id_pengadaanobat: id_pengadaanobat,
            id_barang: id_barang,
            qty: qty
        };
        const input_Pengadaanobat_detail_baru = await Pengadaanobat_detail.create(new_pengadaan_detail);
        res.redirect("/pengadaanobat");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_Pengadaanobat = await Pengadaanobat.findById(req.params.id);
    const cari_Pengadaanobat_detail = await Pengadaanobat_detail.findById(req.params.id);
    res.render("v_pengadaanobat/edit", {
        pengadaanobat_edit_id: cari_Pengadaanobat,
        pengadaan_obat_detail: cari_Pengadaanobat_detail
    });
}))

router.get("/:id/detail", middleware.asyncMiddleware(async (req, res, next) => {
    const pengadaanobat = await Pengadaanobat.findById(req.params.id).populate("id_supplier");
    const detail_pengadaanobat = await Pengadaanobat_detail.find().where('id_pengadaanobat').equals(pengadaanobat.id).populate("id_barang");
    res.render("v_pengadaanobat/detail", {
        data_pengadaan_obat: pengadaanobat,
        pengadaanobat_detail: detail_pengadaanobat
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Pengadaanobat.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/pengadaanobat");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_Pengadaanobat = await Pengadaanobat.findByIdAndRemove(req.params.id);
    res.redirect("/pengadaanobat");
}))

router.get('/cari_supplier', (req, res) => {
    Supplier.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_supplier;
        }
        res.json(d);
    });
});

router.post('/cari_id_supplier', (req, res) => {
    //    console.log(req.body.np);
    Supplier.find({
        'nama_supplier': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.get('/cari_barang', (req, res) => {
    Barang.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_barang;
        }
        res.json(d);
    });
});

router.post('/cari_id_barang', (req, res) => {
    //    console.log(req.body.np);
    Barang.find({
        'nama_barang': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

module.exports = router;