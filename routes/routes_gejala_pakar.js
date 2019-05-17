var express = require('express')
router = express.Router()
Gejala_pakar = require("../models/Tbl_gejala_pakar")
middleware = require("../middleware")
Joi = require("joi")
multer = require("multer")
asyncMiddleware = require("../middleware");


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
    kode_gejala: Joi.string().required(),
    nama_gejala: Joi.string().required(),
    bobot: Joi.number().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const allgejala_pakar = await Gejala_pakar.find({});
    res.render('v_gejalapakar/index', {
        allgejala_pakar: allgejala_pakar
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_gejalapakar/new');
}))

router.post('/new', upload.single('image'), middleware.asyncMiddleware(async (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, async (result) => {
        const kode_gejala = req.body.kode_gejala;
        const nama_gejala = req.body.nama_gejala;
        const bobot = req.body.bobot;
        var image = req.body.image;
        image = {
            link: result.secure_url,
            public_id: result.public_id
        };
        const newGejala = {
            kode_gejala: kode_gejala,
            nama_gejala: nama_gejala,
            bobot: bobot,
            image: image
        }
        const input_bidang_baru = await Gejala_pakar.create(newGejala);
        res.redirect("/gejalapakar");

    })
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_gejalapakar = await Gejala_pakar.findById(req.params.id);
    res.render("v_gejalapakar/edit", {
        cari_gejalapakar: cari_gejalapakar
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema);
    const hasilUpdate = await Gejala_pakar.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            ...req.body
        }
    });
    res.redirect("/gejalapakar");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_diagnosapenyakit = await Gejala_pakar.findByIdAndRemove(req.params.id);
    res.redirect("/gejalapakar");
}))

module.exports = router;