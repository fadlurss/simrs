var express = require('express')
router = express.Router()
multer = require("multer")
Pasien = require("../models/Tbl_pasien")
User = require("../models/user")
Pendaftaran = require("../models/Tbl_pendaftaran")
Tindakan = require("../models/Tbl_tindakan")
Obat = require("../models/Tbl_obat_alkes_bhp")
Kategori_obat = require("../models/Tbl_kategori_barang")
Jenis_bayar = require("../models/Tbl_jenis_bayar")
Dokter = require("../models/Tbl_dokter")
Jadwal_praktek_dokter = require("../models/Tbl_jadwal_praktek_dokter")
Pegawai = require("../models/Tbl_pegawai")
Poliklinik = require("../models/Tbl_poliklinik")
Riwayattindakan = require("../models/Tbl_riwayattindakan")
PJRiwayattindakan = require("../models/Tbl_pj_riwayattindakan")
Riwayatdiagnosa = require("../models/Tbl_riwayatdiagnosa")
PJRiwayatdiagnosa = require("../models/Tbl_pj_riwayatdiagnosa")
Riwayat_diagnosa_pakar = require("../models/Tbl_riwayat_diagnosa")
Riwayat_periksa_lab = require("../models/Tbl_hasil_periksa_lab")
Notification = require("../models/notification")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");
var moment = require('moment');
var phantom = require('phantom');
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

const imageFilter = function (req, file, cb) {
    //accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: imageFilter
})

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'ikutanevent',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


exports.read = middleware.asyncMiddleware(async (req, res, next) => {
    const dada = await Pendaftaran.find({}).populate(
        "id_dokter_penanggung_jawab",
        null, {
            id_users: req.user._id
        }
    ).populate("id_pasien").sort({
        no_rawat: -1
    });
    dadabaru = [];
    for (var i = 0; i < dada.length; i++) {
        if (dada[i].id_dokter_penanggung_jawab != null) {
            dadabaru[i] = dada[i];
        }
    }
    const data_pendaftaran = await Pendaftaran.find({}).sort({
        no_rawat: -1
        // const data_pendaftaran = await Pendaftaran.find({}).sort({
        //     no_rawat: -1  BUAT SORTING DATA
    }).populate("id_dokter_penanggung_jawab").populate("id_pasien");
    res.render('v_pendaftaran/index', {
        databaru: dadabaru,
        data_pendaftaran: data_pendaftaran
    });

})

exports.create = middleware.asyncMiddleware(async (req, res, next) => {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    var counter = await Pendaftaran.find({
        createdAt: {
            $gte: start,
            $lt: end
        }
    }).count();
    const nowmoment = moment().format('dddd');
    const data_dokter = await Dokter.find({});
    const data_jenis_bayar = await Jenis_bayar.find({});
    const data_pasien = await Pasien.find({});
    const data_poli = await Poliklinik.find({});
    const data_jadwal_praktek_dokter = await Jadwal_praktek_dokter.find({}).populate("nama_dokter").populate("poliklinik");
    res.render('v_pendaftaran/new', {
        data_dokter: data_dokter,
        data_jenis_bayar: data_jenis_bayar,
        data_pasien: data_pasien,
        nowmoment: nowmoment,
        data_poliklinik: data_poli,
        counter: (counter + 1),
        data_jadwal_praktek_dokter: data_jadwal_praktek_dokter
    });
})
exports.hasil_laporan_gen = middleware.asyncMiddleware(async (req, res, next) => {
    const start = req.query.tgl_awal;
    const end = req.query.tgl_akhir;
    var url = "/pendaftaran/hasil_laporan?tgl_awal=" + start + "&tgl_akhir=" + end;
    phantom.create().then(function (ph) {
        ph.createPage().then(function (page) {
            page.open("http://www.google.com").then(function (status) {
                if (status !== 'success') {
                    console.log('Unable to load the address!');
                    phantom.exit(1);
                } else {
                    // res.json([]);
                    // page.render("laporan.pdf", function () {
                    //     var gf = fs.createReadStream("laporan.pdf");
                    //     res.setHeader('Content-Type', 'application/pdf');
                    //     res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
                    //     gf.pipe(res);
                    // });
                }
                // phantom.exit();
            });
        });
    });
    res.json([]);


})
exports.hasil_laporan = middleware.asyncMiddleware(async (req, res, next) => {
    const start = req.query.tgl_awal;
    const end = req.query.tgl_akhir;

    const cari_data = await Pendaftaran.find({
        createdAt: {
            $gte: new Date(start),
            $lt: new Date(end)
        }
    }).populate("id_dokter_penanggung_jawab").populate("id_pasien");

    res.render('v_pendaftaran/laporan', {
        cari_data: cari_data,
        start: req.query.tgl_akhir,
        end: req.query.tgl_akhir
    })
})

exports.hasil_laporan_bulanan = middleware.asyncMiddleware(async (req, res, next) => {

    var cari_tanggal_sekarang = Date.now();
    const nowmoment = moment(cari_tanggal_sekarang).format('l');
    const bulan_ini = nowmoment.slice(3, 4) - 1; //mencari bulan dalam
    // const bulan_ini = nowmoment.slice(2, 3) - 1; 
    // console.log(bulan_ini);


    // BULANAN
    var mulai = new Date();
    const al = moment(mulai.setMonth(bulan_ini, 1)).format('L');
    const alarray = al.split("/");
    const newdate = alarray[2] + '-' + alarray[1] + '-' + alarray[0];

    var akhir = new Date();
    const aw = moment(akhir.setMonth(bulan_ini, 31)).format('L');
    const awarray = aw.split("/");
    const newenddate = awarray[2] + '-' + awarray[1] + '-' + awarray[0];

    const cari_data = await Pendaftaran.find({
        createdAt: {
            $gte: new Date(newdate),
            $lt: new Date(newenddate)
        }
    }).populate("id_dokter_penanggung_jawab").populate("id_pasien");
    // AKHIR LAPORAN BULANAN

    res.render('v_pendaftaran/laporan', {
        cari_data: cari_data
    })
})

exports.hasil_laporan_tahunan = middleware.asyncMiddleware(async (req, res, next) => {

    var cari_tanggal_sekarang = Date.now();
    const nowmoment = moment(cari_tanggal_sekarang).format('l');
    const tahun_ini = nowmoment.slice(5); // mencari tahun sekarangå , angka 4 atau 5 (kadang gaberes)
    // const tahun_ini = nowmoment.slice(4);
    // console.log(tahun_ini);


    var mulai = new Date();
    mulai.setFullYear(tahun_ini, 0, 1);
    const al = moment(mulai.setFullYear(tahun_ini, 0, 1)).format('L');
    const alarray = al.split("/");
    const newdate = alarray[2] + '-' + alarray[1] + '-' + alarray[0];
    console.log("Mulai " + newdate);

    var akhir = new Date();
    const aw = moment(akhir.setFullYear(tahun_ini, 11, 31)).format('L');
    const awarray = aw.split("/");
    const newenddate = awarray[2] + '-' + awarray[1] + '-' + awarray[0];
    console.log("Akhir " + newenddate);

    const cari_data = await Pendaftaran.find({
        createdAt: {
            $gte: new Date(newdate),
            $lt: new Date(newenddate)
        }
    }).populate("id_dokter_penanggung_jawab").populate("id_pasien");

    res.render('v_pendaftaran/laporan', {
        cari_data: cari_data
    })
})

exports.post = middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    });
    const {
        value,
        error
    } = result;
    const valid = error == null;
    if (!valid) { // jika tidak valid, atau salah...
        res.status(422).json({
            message: 'Invalid request',
            data: 'error'
        })
        console.log(error);
    } else {
        const input_pendaftaran_baru = await Pendaftaran.create(result.value);
        res.redirect("/pendaftaran");
    }
})

exports.post_riwayat_tindakan = middleware.asyncMiddleware(async (req, res, next) => {
    Pendaftaran.findById(req.params.id, async (err, hasil_pendaftaran) => {
        const newR = await Riwayattindakan.create(req.body);
        hasil_pendaftaran.id_riwayattindakan.push(newR);
        hasil_pendaftaran.status = true;
        hasil_pendaftaran.save();
        const id_riwayat_tindakan = newR.id;
        const id_dokter = req.body.id_dokter;
        const keterangan = req.body.dilakukan_oleh;
        const new_pj_riwayat_tindakan = {
            id_riwayat_tindakan: id_riwayat_tindakan,
            id_dokter: id_dokter._id,
            keterangan: keterangan
        }
        const input_pj_riwayat_tindakan = await PJRiwayattindakan.create(new_pj_riwayat_tindakan);
        res.redirect("/pendaftaran/" + req.params.id + "/detail");
    });
})

exports.post_riwayat_diagnosa = middleware.asyncMiddleware(async (req, res, next) => {
    Pendaftaran.findById(req.params.id, async (err, hasil_pendaftaran) => {
        const input_riwayat_lab = await Riwayat_periksa_lab.create(req.body);
        const input_data_riwayat_diagnosa = {
            ...req.body,
            id_riwayat_periksa_lab: input_riwayat_lab.id
        };
        const newR = await Riwayatdiagnosa.create(input_data_riwayat_diagnosa);
        hasil_pendaftaran.id_riwayatdiagnosa.push(newR);
        hasil_pendaftaran.save();
        const new_pj_riwayat_diagnosa = {
            id_riwayat_diagnosa: newR.id,
            id_dokter: req.body.id_dokter,
            dilakukan_oleh: req.body.dilakukan_oleh
        }
        const input_pj_riwayat_diagnosa = await PJRiwayatdiagnosa.create(new_pj_riwayat_diagnosa);
        res.redirect("/pendaftaran/" + req.params.id + "/detail");
    });
})

exports.detail = middleware.asyncMiddleware(async (req, res, next) => {
    const data_pendaftaran = await Pendaftaran.findById(req.params.id)
        .populate({
            path: "id_pasien",
        })
        .populate("id_dokter_penanggung_jawab")
        .populate({
            path: "id_riwayatdiagnosa",
            populate: {
                path: "id_riwayat_periksa_lab"
            }
        })
        .populate({
            path: "id_riwayattindakan",
            populate: {
                path: "id_tindakan"
            }
        }).populate({
            path: "id_riwayatobat",
            populate: {
                path: "id_obat"
            }
        });
    const data_tindakan = await Tindakan.find({});
    const data_obat = await Obat.find({}).populate("id_kategori_barang");
    console.log(data_obat);

    const data_obat_kategori = await Kategori_obat.find({});
    const data_riwayat_diagnosa_pakar = await Riwayat_diagnosa_pakar.find({
        id_pasien: data_pendaftaran.id_pasien
    });

    total = 0;
    subtotal = 0;

    data_pendaftaran.id_riwayattindakan.forEach(function (comment) {
        total = total + comment.id_tindakan.tarif;
    });

    res.render("v_pendaftaran/detail", {
        data_pendaftaran: data_pendaftaran,
        data_riwayat_diagnosa_pakar: data_riwayat_diagnosa_pakar,
        total: total,
        subtotal: subtotal,
        data_tindakan: data_tindakan,
        data_obat: data_obat
    });
})

exports.edit = middleware.asyncMiddleware(async (req, res, next) => {
    const data_poliklinik = await Poliklinik.find({});
    const data_jenis_bayar = await Jenis_bayar.find({});
    const data_pendaftaran = await Pendaftaran.findById(req.params.id)
        .populate("id_pasien")
        .populate("id_dokter_penanggung_jawab")
        .populate({
            path: "id_riwayatberiobat",
            populate: {
                path: "id_obat"
            }
        })
        .populate({
            path: "id_riwayattindakan",
            populate: {
                path: "id_tindakan"
            }
        });
    res.render("v_pendaftaran/edit", {
        data_pendaftaran: data_pendaftaran,
        data_poliklinik: data_poliklinik,
        data_jenis_bayar: data_jenis_bayar
    });
})

exports.update = middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    });
    const hasilUpdate = await Pendaftaran.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            ...req.body
        }
    });
    res.redirect("/pendaftaran");
})

exports.delete = middleware.asyncMiddleware(async (req, res, next) => {
    const delete_pendaftaran = await Pendaftaran.findByIdAndRemove(req.params.id);
    res.redirect("/pendaftaran");
})

exports.cetak = middleware.asyncMiddleware(async (req, res, next) => {
    const data_pendaftaran = await Pendaftaran.findById(req.params.id)
        .populate({
            path: "id_pasien",
            populate: {
                path: "id_diagnosa_pakar"
            }
        })
        .populate("id_dokter_penanggung_jawab")
        .populate({
            path: "id_riwayatdiagnosa",
            populate: {
                path: "id_riwayat_periksa_lab"
            }
        })
        .populate({
            path: "id_riwayattindakan",
            populate: {
                path: "id_tindakan"
            }
        });

    total = 0;
    subtotal = 0;

    data_pendaftaran.id_riwayattindakan.forEach(function (comment) {
        total = total + comment.id_tindakan.tarif;
    });

    res.render("v_pendaftaran/cetak", {
        data_pendaftaran: data_pendaftaran,
        total: total,
        subtotal: subtotal
    });
})

exports.create_daftarantrian = middleware.asyncMiddleware(async (req, res, next) => {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    const nowmoment = moment().format('dddd');
    const data_user_sekarang = req.user;
    const data_dokter = await Dokter.find({});
    const data_jadwal_praktek_dokter = await Jadwal_praktek_dokter.find({}).populate("nama_dokter").populate("poliklinik");
    const data_poli = await Poliklinik.find({});
    var counter = await Pendaftaran.find({
        createdAt: {
            $gte: start,
            $lt: end
        }
    }).count();
    res.render('v_access/pendaftaran', {
        data_dokter: data_dokter,
        nowmoment: nowmoment,
        data_jadwal_praktek_dokter: data_jadwal_praktek_dokter,
        data_user_sekarang: data_user_sekarang,
        data_poliklinik: data_poli,
        counter: (counter + 1)
    });
})

exports.post_daftarantrian = middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    });
    const {
        value,
        error
    } = result;

    const valid = error == null;
    if (!valid) { // jika tidak valid, atau salah...
        res.status(422).json({
            message: 'Invalid request',
            data: 'error'
        })
        console.log(error);

    } else {
        const dataPasien = await Pasien.findOne({
            id_users: req.body.id_users
        });
        const dataSave = {
            ...value,
            id_pasien: dataPasien._id,
            no_rm: dataPasien.no_rm
        }
        var input_pendaftaran_baru = await Pendaftaran.create(dataSave);

        var data_dokter = await Dokter.findById({
            _id: req.body.id_dokter_penanggung_jawab
        });

        //menambahkan notifikasi ke dokter yang dipilih
        User.findById({
            _id: data_dokter.id_users
        }, async (err, hasilnya) => {
            const newNotification = {
                username: req.user.local.username,
                pendaftaran_id: input_pendaftaran_baru.id
            }
            const notification = await Notification.create(newNotification);
            hasilnya.local.notifications.push(notification);
            hasilnya.save();
        });
        // console.log("data save " + JSON.stringify(req.body));
        req.flash('success', 'Berhasil membuat daftar antrian, silakan cek di profil anda');
        res.redirect("/index");
    }
})



exports.cari_ibu = (req, res) => {
    //    console.log(req.body.np);
    Pasien.find({
        'no_rm': req.body.np
    }, (e, r) => {
        res.json(r);
    });
}

exports.tindakan_oleh = (req, res) => {
    //    console.log(req.body.np);
    Pasien.find({
        'no_rm': req.body.np
    }, (e, r) => {
        res.json(r);
    });
}

exports.cari_dokter = (req, res) => {
    Dokter.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_dokter;
        }
        res.json(d);
    });
}

exports.cari_pegawai = (req, res) => {
    Pegawai.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_pegawai;
        }
        res.json(d);
    });
}

exports.cari_tindakan = (req, res) => {
    Tindakan.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_tindakan;
        }
        res.json(d);
    });
}

exports.cari_obat = (req, res) => {
    Obat.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_barang;
        }
        res.json(d);
    });
}

exports.cari_id_dokter = (req, res) => {
    //    console.log(req.body.np);
    Dokter.find({
        'nama_dokter': req.body.np
    }, (e, r) => {
        res.json(r);
    });
}

exports.cari_id_pegawai = (req, res) => {
    //    console.log(req.body.np);
    Pegawai.find({
        'nama_pegawai': req.body.np
    }, (e, r) => {
        res.json(r);
    });
}

exports.cari_id_tindakan = (req, res) => {
    //    console.log(req.body.np);
    Tindakan.find({
        'nama_tindakan': req.body.np
    }, (e, r) => {
        res.json(r);
    });
}

exports.cari_id_obat = (req, res) => {
    //    console.log(req.body.np);
    Obat.find({
        'nama_barang': req.body.np
    }, (e, r) => {
        res.json(r);
    });
}

exports.contoh = (req, res) => {
    Pasien.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].no_rm;
        }
        res.json(d);
    });
}