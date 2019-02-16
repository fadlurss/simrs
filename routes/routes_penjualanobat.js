var express = require('express')
router = express.Router()
Penjualanobat = require("../models/Tbl_penjualanobat")
Penjualanobat_detail = require("../models/Tbl_penjualanobat_detail")
Pengadaanobat_detail = require("../models/Tbl_pengadaanobat_detail")
Barang = require("../models/Tbl_obat_alkes_bhp")
Supplier = require("../models/Tbl_supplier")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    no_faktur: Joi.number().required(),
    nama_barang: Joi.any(),
    harga: Joi.number().required(),
    qty: Joi.number().required(),
    submit: Joi.any(),
    id_barang: Joi.string().required(),
})


router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allPenjualanobat = await Penjualanobat.find({});
    res.render('v_penjualanobat/index', {
        data_penjualanobat: allPenjualanobat
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_penjualanobat/new');
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const a = {
        value,
        error
    } = result;
    const valid = error == null;
    if (!valid) { // jika tidak valid, atau salah...
        res.status(422).json({
            message: 'Invalid request'
        })

    } else {
        const input_penjualanobat_baru = await Penjualanobat.create(result.value);

        const id_Penjualanobat = input_penjualanobat_baru._id;
        const id_barang = req.body.id_barang;
        const qty = req.body.qty;
        const new_penjualan_detail = {
            id_penjualanobat: id_Penjualanobat,
            id_barang: id_barang,
            qty: qty
        };

        const input_Penjualanobat_detail_baru = await Penjualanobat_detail.create(new_penjualan_detail);
        res.redirect("/penjualanobat");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_Penjualanobat = await Penjualanobat.findById(req.params.id);
    const cari_Penjualanobat_detail = await Penjualanobat_detail.findById(req.params.id);
    res.render("v_Penjualanobat/edit", {
        Penjualanobat_edit_id: cari_Penjualanobat,
        pengadaan_obat_detail: cari_Penjualanobat_detail
    });
}))

router.get("/:id/detail", middleware.asyncMiddleware(async (req, res, next) => {
    const penjualanobat = await Penjualanobat.findById(req.params.id);
    const detail_Penjualanobat = await Penjualanobat_detail.find().where('id_penjualanobat').equals(penjualanobat.id).populate("id_barang");
    res.render("v_Penjualanobat/detail", {
        data_penjualan_obat: penjualanobat,
        penjualanobat_detail: detail_Penjualanobat
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Penjualanobat.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/Penjualanobat");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_Penjualanobat = await Penjualanobat.findByIdAndRemove(req.params.id);
    res.redirect("/Penjualanobat");
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

router.post('/cari_harga_barang', (req, res) => {
    //    console.log(req.body.np);
    Barang.find({
        'nama_barang': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

module.exports = router;