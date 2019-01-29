var express = require('express')
router = express.Router()
Jpd = require("../models/Tbl_jadwal_praktek_dokter") // Jpd = jadwal praktek dokter
Poliklinik = require("../models/Tbl_poliklinik")
middleware = require("../middleware")
asyncMiddleware = require("../middleware");

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const data_jpd = await Jpd.find({}).populate("poliklinik");
    res.render('v_jpd/index', {
        data_jpd: data_jpd
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_poliklinik = await Poliklinik.find({});
    res.render("v_jpd/new", {
        data_poliklinik: data_poliklinik
    });
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const hari = req.body.hari;
    const jam_mulai = req.body.jam_mulai;
    const jam_selesai = req.body.jam_selesai;
    const poliklinik = req.body.poliklinik;
    const newJpd = {
        hari: hari,
        jam_mulai: jam_mulai,
        jam_selesai: jam_selesai,
        poliklinik: poliklinik
    };
    const input_Jpd_baru = await Jpd.create(newJpd);
    res.redirect("/jadwalpraktek")
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_jpd = await Jpd.findById(req.params.id);
    const data_poliklinik = await Poliklinik.find({});
    res.render("v_jpd/edit", {
        jpd_edit_id: cari_jpd,
        data_poliklinik: data_poliklinik
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Jpd.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/jadwalpraktek");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_jpd = await Jpd.findByIdAndRemove(req.params.id);
    res.redirect("/jadwalpraktek");
}))

module.exports = router;