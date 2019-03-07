var mongoose = require("mongoose");
//Tbl  barang keluar
var tbl_barang_keluarSchema = mongoose.Schema({
    id_barang_keluar_transaksi: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_barang_keluar_transaksi'
    },
    id_barang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_barang'
    },
    total_keluar: {
        type: Number
    },
    harga_modal: {
        type: Number
    },
    harga_jual: {
        type: Number
    },
    tgl_keluar: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
    collection: 'tbl_barang_keluar',
    versionKey: false
});

module.exports = mongoose.model("Tbl_barang_keluar", tbl_barang_keluarSchema);