var express = require('express')
router = express.Router()
Supplier = require("../models/Tbl_supplier")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    nama_supplier: Joi.string().required(),
    alamat: Joi.string().required(),
    no_telepon: Joi.number().required(),
    submit: Joi.any()
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const data_supplier = await Supplier.find({});
    res.render('v_supplier/index', {
        data_supplier: data_supplier
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_supplier/new');
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const {
        value,
        error
    } = result;
    const valid = error == null;
    if (!valid) { // jika tidak valid, atau salah...
        res.status(422).json({
            message: 'Invalid request'
        })
    } else {
        const input_kategori_baru = await Supplier.create(result.value);
        res.redirect("/supplier");
    }
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_Supplier = await Supplier.findById(req.params.id);
    res.render("v_supplier/edit", {
        supplier_edit_id: cari_Supplier
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({ ...req.body
    }, schema);
    const hasilUpdate = await Supplier.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: { ...req.body
        }
    });
    res.redirect("/supplier");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_Supplier = await Supplier.findByIdAndRemove(req.params.id);
    res.redirect("/supplier");
}))

module.exports = router;