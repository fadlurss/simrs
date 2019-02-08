var express = require('express')
router = express.Router()
Pemeriksaan_laboratorium = require("../models/Tbl_pemeriksaan_laboratorium")
Pengadaanobat_detail = require("../models/Tbl_pengadaanobat_detail")
Barang = require("../models/Tbl_obat_alkes_bhp")
Supplier = require("../models/Tbl_supplier")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    kode_periksa: Joi.string().required(),
    nama_periksa: Joi.string().required(),
    tarif: Joi.number().required(),
    submit: Joi.any()
})


router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allpemeriksaanlaboratorium = await Pemeriksaan_laboratorium.find({}).populate("id_supplier");
    res.render('v_pemeriksaanlaboratorium/index', {
        data_pemeriksaan_laboratorium: allpemeriksaanlaboratorium
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_pemeriksaanlaboratorium/new');
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
        console.log("error 1: " + error);

    } else {
        const input_Pengadaanobat_baru = await Pemeriksaan_laboratorium.create(result.value);
        res.redirect("/pemeriksaanlaboratorium");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_pemeriksaan_laboratorium = await Pemeriksaan_laboratorium.findById(req.params.id);
    res.render("v_pemeriksaanlaboratorium/edit", {
        pemeriksaanlaboratorium_edit_id: cari_pemeriksaan_laboratorium
    });
}))

router.get("/:id/detail", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_pemeriksaan_laboratorium = await Pemeriksaan_laboratorium.findById(req.params.id);
    res.render("v_pemeriksaanlaboratorium/detail", {
        data_pemeriksaan_laboratorium: cari_pemeriksaan_laboratorium
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Pemeriksaan_laboratorium.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/pemeriksaanlaboratorium");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_pemeriksaan_laboratorium = await Pemeriksaan_laboratorium.findByIdAndRemove(req.params.id);
    res.redirect("/pemeriksaanlaboratorium");
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