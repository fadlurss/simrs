const Jpd = require("../models/Tbl_jadwal_praktek_dokter") // Jpd = jadwal praktek dokter
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

exports.read_dokter = middleware.asyncMiddleware(async (req, res, next) => {
    const data_dokter = await Dokter.find({}).populate("agama").populate("status_menikah").populate("spesialis");
    res.render('v_dokter/index', {
        data_dokter: data_dokter
    });
})

exports.create_dokter = middleware.asyncMiddleware(async (req, res, next) => {
    const data_agama = await Agama.find({});
    const data_status_menikah = await Status_menikah.find({});
    const data_spesialis = await Spesialis.find({});
    res.render("v_dokter/new", {
        data_agama: data_agama,
        data_status_menikah: data_status_menikah,
        data_spesialis: data_spesialis
    });
})

exports.post_dokter = middleware.asyncMiddleware(async (req, res, next) => {
    const add_users = {
        "local.email": req.body.email,
        "local.password": newUser.generateHash(req.body.password),
        "local.firstName": req.body.nama_dokter,
        "local.username": req.body.username,
        "local.level": "Dokter",
        "local.activeReg": true
    };
    const input_users_baru = await Users.create(add_users);
    const id_users = input_users_baru._id;
    const add_dokter = {
        id_users: id_users,
        ...req.body
    }
    const input_dokter_baru = await Dokter.create(add_dokter);
    res.redirect("/dokter");
})

exports.edit_dokter = middleware.asyncMiddleware(async (req, res, next) => {
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
})

exports.update_dokter = middleware.asyncMiddleware(async (req, res, next) => {
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
})

exports.delete_dokter = middleware.asyncMiddleware(async (req, res, next) => {
    const delete_dokter = await Dokter.findByIdAndRemove(req.params.id);
    res.redirect("/dokter");
})