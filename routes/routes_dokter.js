var express = require('express')
router = express.Router()
Jpd = require("../models/Tbl_jadwal_praktek_dokter") // Jpd = jadwal praktek dokter
Dokter = require("../models/Tbl_dokter")
Petugas = require("../models/Tbl_petugas")
Users = require("../models/user")
Poliklinik = require("../models/Tbl_poliklinik")
Agama = require("../models/Tbl_agama")
Status_menikah = require("../models/Tbl_status_menikah")
Spesialis = require("../models/Tbl_spesialis")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const newUser = Users();
const schema = Joi.object().keys({
    nama_dokter: Joi.string().required(),
    jenis_kelamin: Joi.any().valid('Laki-laki', 'Perempuan'),
    tempat_lahir: Joi.string().required(),
    tanggal_lahir: Joi.string().required(),
    agama: Joi.string().required(),
    alamat: Joi.string().required(),
    no_hp: Joi.number().min(11).required().integer(),
    gaji_pokok: Joi.number().required(),
    tarif_dokter: Joi.number().required(),
    status_menikah: Joi.string().required(),
    spesialis: Joi.string().required(),
    no_izin_praktek: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.Admin, middleware.asyncMiddleware(async (req, res, next) => {
    const data_dokter = await Dokter.find({}).populate("agama").populate("status_menikah").populate("spesialis");
    res.render('v_dokter/index', {
        data_dokter: data_dokter
    });
}))

router.get('/new', middleware.Admin, middleware.asyncMiddleware(async (req, res, next) => {
    const data_agama = await Agama.find({});
    const data_status_menikah = await Status_menikah.find({});
    const data_spesialis = await Spesialis.find({});
    res.render("v_dokter/new", {
        data_agama: data_agama,
        data_status_menikah: data_status_menikah,
        data_spesialis: data_spesialis
    });
}))

router.post('/new', middleware.Admin, middleware.asyncMiddleware(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const nama_dokter = req.body.nama_dokter;
    const username = req.body.username;
    const add_users = {
        "local.email": email,
        "local.password": newUser.generateHash(password),
        "local.firstName": nama_dokter,
        "local.username": username,
        "local.level": "Dokter",
        "local.activeReg": true
    };
    const input_users_baru = await Users.create(add_users);
    const id_users = input_users_baru._id;
    const jenis_kelamin = req.body.jenis_kelamin;
    const tempat_lahir = req.body.tempat_lahir;
    const tanggal_lahir = req.body.tanggal_lahir;
    const agama = req.body.agama;
    const alamat = req.body.alamat;
    const no_hp = req.body.no_hp;
    const gaji_pokok = req.body.gaji_pokok;
    const tarif_dokter = req.body.tarif_dokter;
    const status_menikah = req.body.status_menikah;
    const spesialis = req.body.spesialis;
    const no_izin_praktek = req.body.no_izin_praktek;
    const add_dokter = {
        id_users: id_users,
        nama_dokter: nama_dokter,
        jenis_kelamin: jenis_kelamin,
        tempat_lahir: tempat_lahir,
        tanggal_lahir: tanggal_lahir,
        agama: agama,
        alamat: alamat,
        no_hp: no_hp,
        gaji_pokok: gaji_pokok,
        tarif_dokter: tarif_dokter,
        status_menikah: status_menikah,
        spesialis: spesialis,
        no_izin_praktek: no_izin_praktek
    }
    const input_dokter_baru = await Dokter.create(add_dokter);
    res.redirect("/dokter");
}))

router.get("/:id/edit", middleware.Admin, middleware.asyncMiddleware(async (req, res, next) => {
    const cari_dokter = await Dokter.findById(req.params.id);
    const data_agama = await Agama.find({});
    const data_status_menikah = await Status_menikah.find({});
    const data_spesialis = await Spesialis.find({});
    res.render("v_dokter/edit", {
        dokter_edit_id: cari_dokter,
        data_agama: data_agama,
        data_spesialis: data_spesialis,
        data_status_menikah: data_status_menikah
    });
}))

router.put("/:id", middleware.Admin, middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema);
    const hasilUpdate = await Dokter.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            ...req.body
        }
    });
    res.redirect("/dokter");
}))

router.delete("/:id", middleware.Admin, middleware.asyncMiddleware(async (req, res, next) => {
    const delete_dokter = await Dokter.findByIdAndRemove(req.params.id);
    res.redirect("/dokter");
}))

module.exports = router;