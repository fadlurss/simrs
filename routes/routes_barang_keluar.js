var express = require('express')
router = express.Router()
Barang_keluar_transaksi = require("../models/Tbl_barang_keluar_transaksi")
Barang_keluar = require("../models/Tbl_barang_keluar")
Bendaa = require("../models/Tbl_barang")
middleware = require("../middleware")
Joi = require("joi")
asyncMiddleware = require("../middleware");

const schema = Joi.object().keys({
    no_faktur: Joi.any(),
    total_bayar: Joi.any(),
    id_barang: Joi.string().required(),
    nama_barang: Joi.any(),
    stok_barang: Joi.any(),
    total_keluar: Joi.number().required(),
    harga_barang: Joi.number().required(),
    harga_modal: Joi.number().required()
})

const schema2 = Joi.object().keys({
    total_diterima: Joi.number().required(),
})

router.get('/', middleware.asyncMiddleware(async (req, res, next) => {
    const data_barang_keluar_transaksi = await Barang_keluar_transaksi.find({});
    res.render('v_barang_keluar/index', {
        data_barang_keluar_transaksi: data_barang_keluar_transaksi
    });
}))
router.get('/getdata', middleware.asyncMiddleware(async (req, res, next) => {
    const data_barang_keluar_transaksi = await Barang_keluar_transaksi.find({});
    var data = [];
    data.push("data");
    no = 1;
    var td = [];
    for (var index = 0; index < data_barang_keluar_transaksi.length; index++) {
        var element = data_barang_keluar_transaksi[index];
        td.push([no++, element.no_faktur, element.total_bayar, element.status_transaksi, element.tgl_transaksi_keluar]);
    }
    res.json({
        "data": td
    });
}))
router.post('/savebrg', middleware.asyncMiddleware(async (req, res, next) => {
  var data = req.body;
  const save = await Barang_keluar.create(req.body);
  if (save != null) {
      res.json({
          "status": 1,
          "msg": "Data Di Simpan",
          data: save
      });
  } else {
      res.json({
          "status": 0,
          "msg": "Data Gagal Di Simpan"
      });
  }
}))
router.get('/barangget/:_id', middleware.asyncMiddleware(async (req, res, next) => {
    const cari = await Bendaa.find(req.params);
    if (cari.length > 0) {
      res.json({status:1,msg:"Data Ditemukan",harga_jual:cari[0].harga_jual,harga_modal:cari[0].harga_modal});
    }else {
      res.json({status:0,msg:"Data Tidak Ditemukan"});
    }
}))
// const data_barang_masuk = await Barang_masuk.find({}).populate("id_barang").populate("id_supplier");
router.get('/getdatabarangjoin/:_id', middleware.asyncMiddleware(async (req, res, next) => {
  const list = await Barang_keluar.find({}).populate("id_barang");
  var data = [];
  for (var i = 0; i < list.length; i++) {
    data.push([list[i]._id,list[i].id_barang.nama_barang,list[i].total_keluar,list[i].harga_jual,(list[i].harga_jual*list[i].total_keluar)]);
  }
  res.json({"data":data});
}))
router.get('/getdatabarang', middleware.asyncMiddleware(async (req, res, next) => {
    const barang = await Bendaa.find({});
    var s2 = [];
    s2.push({
        "text": "== Pilih ==",
        "id": ""
    });
    for (let index = 0; index < barang.length; index++) {
        const element = barang[index];
        s2.push({
            "text": element.nama_barang,
            "id": element._id
        });
    }
    res.json(s2);
}))

router.post('/save', middleware.asyncMiddleware(async (req, res, next) => {
    var data = req.body;
    const input_transaksi_barang_keluar = await Barang_keluar_transaksi.create(req.body);
    if (input_transaksi_barang_keluar != null) {
        res.json({
            "status": 1,
            "msg": "Data Di Simpan",
            data: input_transaksi_barang_keluar
        });
    } else {
        res.json({
            "status": 0,
            "msg": "Data Gagal Di Simpan"
        });
    }

}))
router.get('/new', middleware.asyncMiddleware(async (req, res, next) => {
    const data_barang = await Bendaa.find({});
    const data_barang_keluar = await Barang_keluar_transaksi.find({});
    res.render("v_barang_keluar/new", {
        data_barang: data_barang,
        data_barang_keluar: data_barang_keluar
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
        const new_barang_keluar = await Barang_keluar_transaksi.create(result.value);
        // console.log(new_barang_keluar._id);
        const update_barang = await Bendaa.findOneAndUpdate({
            _id: req.body.id_barang
        }, {
            $inc: {
                stok: -req.body.total_keluar
            }
        });
        res.redirect("/penjualan/" + new_barang_keluar._id);
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

router.get("/:id/edit2", middleware.asyncMiddleware(async (req, res, next) => {
    const edit_barang_masuk = await Barang_masuk.findById(req.params.id);
    res.render("v_barang_masuk/modal", {
        edit_barang_masuk: edit_barang_masuk
    });
}))

router.put("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const result = Joi.validate({
        ...req.body
    }, schema2);
    const update_barang_masuk = await Barang_masuk.findOneAndUpdate({
        _id: req.params.id
    }, {
        $inc: {
            ...req.body,
            status_penerimaan: "Selesai"
        }
    });
    const update_barang = await Benda.findOneAndUpdate({
        $inc: {
            stok: +req.body.total_diterima
        }
    });
    res.redirect("/stokopname");
}))

router.delete("/:id", middleware.asyncMiddleware(async (req, res, next) => {
    const delete_barang = await Item.findByIdAndRemove(req.params.id);
    res.redirect("/barang");
}))

router.get('/cari_barang', (req, res) => {
    Bendaa.find({}, function (err, re) {
        d = [];
        for (let ix = 0; ix < re.length; ix++) {
            d[ix] = re[ix].nama_barang;
        }
        res.json(d);
    });
});

router.post('/cari_stok_item', (req, res) => {
    //    console.log(req.body.np);
    Bendaa.find({
        'nama_barang': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.post('/id_item', (req, res) => {
    //    console.log(req.body.np);
    Bendaa.find({
        'nama_barang': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.post('/harga_item', (req, res) => {
    Bendaa.find({
        'nama_barang': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

router.post('/harga_modal', (req, res) => {
    Bendaa.find({
        'nama_barang': req.body.np
    }, (e, r) => {
        res.json(r);
    });
});

module.exports = router;
