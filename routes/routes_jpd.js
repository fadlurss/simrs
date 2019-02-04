var express = require('express')
router = express.Router()
Dokter = require("../models/Tbl_dokter")
Jpd = require("../models/Tbl_jadwal_praktek_dokter") // Jpd = jadwal praktek dokter
Poliklinik = require("../models/Tbl_poliklinik")
middleware = require("../middleware")
asyncMiddleware = require("../middleware");

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const data_jpd = await Jpd.find({}).populate("poliklinik").populate("nama_dokter");
    res.render('v_jpd/index', {
        data_jpd: data_jpd
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_dokter = await Dokter.find({});
    const data_poliklinik = await Poliklinik.find({});
    res.render("v_jpd/new", {
        data_poliklinik: data_poliklinik,
        data_dokter: data_dokter
    });
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const input_Jpd_baru = await Jpd.create({ ...req.body
    });
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