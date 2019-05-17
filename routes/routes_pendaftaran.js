var express = require('express')
router = express.Router()
multer = require("multer")
Pasien = require("../models/Tbl_pasien")
User = require("../models/user")
Pendaftaran = require("../models/Tbl_pendaftaran")
Tindakan = require("../models/Tbl_tindakan")
Obat = require("../models/Tbl_obat_alkes_bhp")
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
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");
var moment = require('moment');
var now = moment().toDate();

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

const schema = Joi.object().keys({
    no_registrasi: Joi.number().required(),
    no_rawat: Joi.string(),
    id_users: Joi.string(),
    no_rm: Joi.any(),
    tgl_daftar: Joi.date().required(),
    id_dokter_penanggung_jawab: Joi.string().required(),
    nama_dokter: Joi.any(),
    nama_pasien: Joi.string(),
    id_pasien: Joi.string(),
    id_poliklinik: Joi.string(),
    tanggal_lahir: Joi.string(),
    tanggal_sekarang: Joi.any(),
    submit: Joi.any()
})

const schema2 = Joi.object().keys({
    kode_pj: Joi.any(),
    id_pendaftaran: Joi.string().required(),
    id_dokter: Joi.any(),
    id_dokter2: Joi.any(),
    id_pegawai: Joi.any(),
    id_petugas: Joi.any(),
    id_pegawai2: Joi.any(),
    nama_dokter: Joi.any(),
    nama_dokter2: Joi.any(),
    nama_pegawai: Joi.any(),
    nama_pegawai2: Joi.any(),
    nama_tindakan: Joi.any(),
    dilakukan_oleh: Joi.any(),
    nama_petugas: Joi.any(),
    id_tindakan: Joi.string().required(),
    no_rawat: Joi.any(),
    hasil_periksa: Joi.string().required(),
    perkembangan: Joi.string().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const dada = await Pendaftaran.find({}).populate(
        "id_dokter_penanggung_jawab",
        null, {
            id_users: req.user._id
        }
    ).populate("id_pasien");
    dadabaru = [];
    for (var i = 0; i < dada.length; i++) {
        if (dada[i].id_dokter_penanggung_jawab != null) {
            dadabaru[i] = dada[i];
        }
    }

    const data_pendaftaran = await Pendaftaran.find({}).populate("id_dokter_penanggung_jawab").populate("id_pasien");
    res.render('v_pendaftaran/index', {
        databaru: dadabaru,
        data_pendaftaran: data_pendaftaran
    });

}))


router.get('/new', middleware.Petugas, middleware.asyncMiddleware(async (req, res, next) => {
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
    const data_dokter = await Dokter.find({});
    const data_jenis_bayar = await Jenis_bayar.find({});
    const data_pasien = await Pasien.find({});
    const data_poli = await Poliklinik.find({});




    res.render('v_pendaftaran/new', {
        data_dokter: data_dokter,

        data_jenis_bayar: data_jenis_bayar,
        data_pasien: data_pasien,
        data_poliklinik: data_poli,
        counter: (counter + 1)
    });
}))

router.post('/new', middleware.Petugas, middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema);
    const {
        value,
        error
    } = result;
    const valid = error == null;
    if (!valid) { // jika tidak valid, atau salah...
        res.status(422).json({
            message: 'Terdapat kesalahan input data, silakan kembali dan refresh halamannya',
            data: 'error'
        })
        console.log(error);

    } else {
        const result = Joi.validate({
            ...req.body
        }, schema);
        const {
            value,
            error
        } = result;
        const valid = error == null;
        if (!valid) { // jika tidak valid, atau salah...
            res.status(422).json({
                message: 'Terdapat kesalahan input data, silakan kembali dan refresh halamannya',
                data: 'error'
            })
            console.log(error);

        } else {
            const input_pendaftaran_baru = await Pendaftaran.create(result.value);
            res.redirect("/pendaftaran");
        }
    }
}))

// daftar antrian online
router.get('/daftar', middleware.asyncMiddleware(async (req, res, next) => {
    // 

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
}))


router.post('/daftar', middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema);
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
        // console.log(dataPasien);

        const dataSave = {
            ...value,
            id_pasien: dataPasien._id,
            no_rm: dataPasien.no_rm
        }
        console.log("data save " + JSON.stringify(req.body));

        const input_pendaftaran_baru = await Pendaftaran.create(dataSave);
        console.log(input_pendaftaran_baru);

        res.redirect("/index");
    }
}))

router.post('/:id/new_riwayattindakan', middleware.Dokter, middleware.asyncMiddleware(async (req, res, next) => {
    Pendaftaran.findById(req.params.id, async (err, hasil_pendaftaran) => {
        const newR = await Riwayattindakan.create(req.body);
        hasil_pendaftaran.id_riwayattindakan.push(newR);
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
}))

// router.post('/:id/new_riwayatdiagnosa', middleware.asyncMiddleware(async (req, res, next) => {
//     Pendaftaran.findById(req.params.id, async (err, hasil_pendaftaran) => {
//         const newR = await Riwayatdiagnosa.create(req.body);
//         hasil_pendaftaran.id_riwayatdiagnosa.push(newR);
//         hasil_pendaftaran.save();
//         const id_riwayat_diagnosa = newR.id;
//         const id_dokter = req.body.id_dokter;
//         const dilakukan_oleh = req.body.dilakukan_oleh;
//         const id_pasien = req.body.id_pasien;
//         const umur_pasien = req.body.umur_pasien;
//         const alamat_pasien = req.body.alamat_pasien;
//         const tanggal_periksa = req.body.tanggal_periksa;
//         const jenis_pemeriksaan = req.body.jenis_pemeriksaan;
//         const hasil_pemeriksaan = req.body.hasil_pemeriksaan;
//         const satuan = req.body.satuan;
//         const nilai_rujukan = req.body.nilai_rujukan;
//         const new_pj_riwayat_diagnosa = {
//             id_riwayat_diagnosa: id_riwayat_diagnosa,
//             id_dokter: id_dokter._id,
//             dilakukan_oleh: dilakukan_oleh
//         }
//         const new_riwayat_lab = {
//             id_riwayat_diagnosa: id_riwayat_diagnosa,
//             id_dokter: id_dokter._id,
//             dilakukan_oleh: dilakukan_oleh,
//             id_pasien: id_pasien,
//             umur_pasien: umur_pasien,
//             alamat_pasien: alamat_pasien,
//             tanggal_periksa: tanggal_periksa,
//             jenis_pemeriksaan: jenis_pemeriksaan,
//             hasil_pemeriksaan: hasil_pemeriksaan,
//             satuan: satuan,
//             nilai_rujukan: nilai_rujukan
//         }
//         const input_pj_riwayat_diagnosa = await PJRiwayatdiagnosa.create(new_pj_riwayat_diagnosa);
//         const input_riwayat_lab = await Riwayat_periksa_lab.create(new_riwayat_lab);
//         res.redirect("/pendaftaran/" + req.params.id + "/detail");
//     });
// }))

router.post('/:id/new_riwayatdiagnosa', middleware.Dokter, middleware.asyncMiddleware(async (req, res, next) => {
    Pendaftaran.findById(req.params.id, async (err, hasil_pendaftaran) => {
        const id_dokter = req.body.id_dokter;
        const dilakukan_oleh = req.body.dilakukan_oleh;
        const id_pasien = req.body.id_pasien;
        const umur_pasien = req.body.umur_pasien;
        const alamat_pasien = req.body.alamat_pasien;
        const tanggal_periksa = req.body.tanggal_periksa;
        const jenis_pemeriksaan = req.body.jenis_pemeriksaan;
        const hasil_pemeriksaan = req.body.hasil_pemeriksaan;
        const satuan = req.body.satuan;
        const nilai_rujukan = req.body.nilai_rujukan;
        const new_riwayat_lab = {
            id_dokter: id_dokter._id,
            dilakukan_oleh: dilakukan_oleh,
            id_pasien: id_pasien,
            umur_pasien: umur_pasien,
            alamat_pasien: alamat_pasien,
            tanggal_periksa: tanggal_periksa,
            jenis_pemeriksaan: jenis_pemeriksaan,
            hasil_pemeriksaan: hasil_pemeriksaan,
            satuan: satuan,
            nilai_rujukan: nilai_rujukan
        }
        const input_riwayat_lab = await Riwayat_periksa_lab.create(new_riwayat_lab);
        const get_id_riwayatlab = input_riwayat_lab.id;
        const ds = req.body.ds;
        const doo = req.body.do;
        const keterangan = req.body.keterangan;
        const input_data_riwayat_diagnosa = {
            ds: ds,
            do: doo,
            keterangan: keterangan,
            id_riwayat_periksa_lab: get_id_riwayatlab
        };
        const newR = await Riwayatdiagnosa.create(input_data_riwayat_diagnosa);
        hasil_pendaftaran.id_riwayatdiagnosa.push(newR);
        hasil_pendaftaran.save();
        const id_riwayat_diagnosa = newR.id;

        const new_pj_riwayat_diagnosa = {
            id_riwayat_diagnosa: id_riwayat_diagnosa,
            id_dokter: id_dokter._id,
            dilakukan_oleh: dilakukan_oleh
        }

        const input_pj_riwayat_diagnosa = await PJRiwayatdiagnosa.create(new_pj_riwayat_diagnosa);

        const add = {
            id_riwayat_periksa_lab: get_id_riwayatlab
        }
        // const gamma = await Riwayatdiagnosa.findOneAndUpdate(add);
        res.redirect("/pendaftaran/" + req.params.id + "/detail");
    });
}))

router.post('/:id/new_riwayatlab', middleware.Dokter, middleware.asyncMiddleware(async (req, res, next) => {
    Pendaftaran.findById(req.params.id, async (err, hasil) => {
        const newR = await Riwayat_periksa_lab.create(req.body);
        hasil.id_riwayat_periksa_lab.push(newR);
        hasil.save();
        res.redirect("/pendaftaran/" + req.params.id + "/detail");
    });
}))


router.get("/:id/detail", middleware.DokterdanPetugas, middleware.asyncMiddleware(async (req, res, next) => {
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
        });
    const data_riwayat_diagnosa_pakar = await Riwayat_diagnosa_pakar.find({
        id_pasien: data_pendaftaran.id_pasien
    });



    // console.log(data_pendaftaran.id_riwayatdiagnosa[0].id_riwayat_periksa_lab);
    // const pipeline = [{
    //         $project: {
    //             _id: 0,
    //             Riwayatdiagnosa: "$$ROOT"
    //         }
    //     },
    //     {
    //         $lookup: {
    //             "localField": Riwayatdiagnosa.id_riwayat_periksa_lab,
    //             "from": Riwayat_periksa_lab,
    //             "foreignField": "_id",
    //             "as": Riwayat_periksa_lab
    //         }
    //     },
    //     {
    //         $unwind: {
    //             "path": "$Riwayat_periksa_lab",
    //             "preserveNullAndEmptyArrays": false
    //         }
    //     }
    // ];

    // console.log(pipeline);



    total = 0;
    subtotal = 0;

    data_pendaftaran.id_riwayattindakan.forEach(function (comment) {
        total = total + comment.id_tindakan.tarif;
    });

    res.render("v_pendaftaran/detail", {
        data_pendaftaran: data_pendaftaran,
        data_riwayat_diagnosa_pakar: data_riwayat_diagnosa_pakar,
        total: total,
        subtotal: subtotal
    });
}))

router.get("/:id/cetak", middleware.Dokter, middleware.asyncMiddleware(async (req, res, next) => {
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
    // console.log(data_pendaftaran.id_riwayatdiagnosa[0].id_riwayat_periksa_lab);
    // const pipeline = [{
    //         $project: {
    //             _id: 0,
    //             Riwayatdiagnosa: "$$ROOT"
    //         }
    //     },
    //     {
    //         $lookup: {
    //             "localField": Riwayatdiagnosa.id_riwayat_periksa_lab,
    //             "from": Riwayat_periksa_lab,
    //             "foreignField": "_id",
    //             "as": Riwayat_periksa_lab
    //         }
    //     },
    //     {
    //         $unwind: {
    //             "path": "$Riwayat_periksa_lab",
    //             "preserveNullAndEmptyArrays": false
    //         }
    //     }
    // ];

    // console.log(pipeline);



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
}))

router.get("/:id/edit", middleware.Petugas, middleware.asyncMiddleware(async (req, res, next) => {
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
}))

router.put("/:id", middleware.Petugas, middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema);
    const hasilUpdate = await Pendaftaran.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            ...req.body
        }
    });
    res.redirect("/pendaftaran");
}))

router.delete("/:id", middleware.Petugas, middleware.asyncMiddleware(async (req, res, next) => {
    const delete_pendaftaran = await Pendaftaran.findByIdAndRemove(req.params.id);
    res.redirect("/pendaftaran");
}))

router.get('/contoh', (req, res) => {
    Pasien.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].no_rm;
        }
        res.json(d);
    });
});

router.post('/cariibu', (req, res) => {
    //    console.log(req.body.np);
    Pasien.find({
        'no_rm': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.post('/tindakan_oleh', (req, res) => {
    //    console.log(req.body.np);
    Pasien.find({
        'no_rm': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.get('/cari_dokter', (req, res) => {
    Dokter.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_dokter;
        }
        res.json(d);
    });
});

router.get('/cari_pegawai', (req, res) => {
    Pegawai.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_pegawai;
        }
        res.json(d);
    });
});

router.get('/cari_tindakan', (req, res) => {
    Tindakan.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_tindakan;
        }
        res.json(d);
    });
});

router.get('/cari_obat', (req, res) => {
    Obat.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_barang;
        }
        res.json(d);
    });
});

router.post('/cari_id_dokter', (req, res) => {
    //    console.log(req.body.np);
    Dokter.find({
        'nama_dokter': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.post('/cari_id_pegawai', (req, res) => {
    //    console.log(req.body.np);
    Pegawai.find({
        'nama_pegawai': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.post('/cari_id_tindakan', (req, res) => {
    //    console.log(req.body.np);
    Tindakan.find({
        'nama_tindakan': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.post('/cari_id_obat', (req, res) => {
    //    console.log(req.body.np);
    Obat.find({
        'nama_barang': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});


module.exports = router;