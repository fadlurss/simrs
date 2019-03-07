var express = require('express')
router = express.Router()
Barang_masuk = require("../models/Tbl_barang_masuk")
Benda = require("../models/Tbl_barang")
Supplier = require("../models/Tbl_supplier")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    status_penerimaan: Joi.any(),
    total_bayar: Joi.number().required(),
    total_masuk: Joi.number().required(),
    harga_modal: Joi.number().required(),
    id_barang: Joi.string().required(),
    id_supplier: Joi.string().required(),
    nama_barang: Joi.any(),
})

const schema2 = Joi.object().keys({
    total_diterima: Joi.number().required(),
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    stok_minimum = 0;
    const data_item = await Benda.find({});
    data_item.forEach(function (comment) {
        stok_minimum = comment.stok_minimum;
    });

    const data_barang = await Benda.find({
        "stok": {
            "$lt": stok_minimum // CARI STOK BARANG YANG KURANG DARI STOK MINIMUM
        }
    });

    const data_barang_masuk = await Barang_masuk.find({}).populate("id_barang").populate("id_supplier");
    res.render('v_barang_masuk/index', {
        data_barang_masuk: data_barang_masuk,
        data_barang: data_barang
    });
}))

router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_barang = await Barang.find({});
    const data_supplier = await Supplier.find({});
    res.render("v_barang_masuk/new", {
        data_barang: data_barang,
        data_supplier: data_supplier
    });
}))

router.post('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema);
    console.log(result.error);
    const {
        value,
        error
    } = result;
    const valid = error == null;
    if (!valid) {
        res.status(422).json({
            message: 'Invalide request',
            data: result
        })
    } else {
        const new_barang_masuk = await Barang_masuk.create(result.value);
        res.redirect("/stokopname");
    }
}))

router.get("/:id/new", middleware.asyncMiddleware(async (req, res, next) => {
    const cari_barang = await Benda.findById(req.params.id);
    const data_supplier = await Supplier.find({});
    res.render("v_barang_masuk/new", {
        data_barang: cari_barang,
        data_supplier: data_supplier
    });
}))

router.get("/:id/edit", middleware.asyncMiddleware(async (req, res, next) => {
    const edit_barang_masuk = await Barang_masuk.findById(req.params.id);
    res.render("v_barang_masuk/edit", {
        edit_barang_masuk: edit_barang_masuk
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema2);
    if (req.body.total_diterima > (req.body.tmasuk - req.body.tterima)) {
        res.redirect("/stokopname");
    } else {
        const update_barang_masuk = await Barang_masuk.findOneAndUpdate({
            _id: req.params.id
        }, {
            $inc: {
                ...req.body
            },
            $set: {
                status_penerimaan: "Selesai"
            }
        });
        const update_barang = await Benda.findOneAndUpdate({
            $inc: {
                stok: +req.body.total_diterima
            }
        });
        res.redirect("/stokopname");
    }

}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_barang = await Item.findByIdAndRemove(req.params.id);
    res.redirect("/barang");
}))

module.exports = router;



// status_penerimaan: {
//     $cond: {
//         if: {
//             $gte: ["$total_diterima", 2]
//         },
//         then: {
//             $set: {
//                 status_penerimaan: "Selesai"
//             }
//         }
//     }
// }
// }, {
//     $project: {
//         item: 1,
//         discount: {
//             $cond: {
//                 if: {
//                     $gte: ["$total_diterima", 2]
//                 },
//                 then: 30,
//                 else: 20
//             }
//         }
//     }
// status_penerimaan: {
//     $cond: {
//         if: {
//             $gte: ["$total_diterima", 2]
//         },
//         then: {
//             $set: {
//                 status_penerimaan: "Selesai"
//             }
//         }
//     }
// }