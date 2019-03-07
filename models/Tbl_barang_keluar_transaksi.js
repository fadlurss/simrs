var mongoose = require("mongoose");
//Tbl transaksi barang keluar
var tbl_barang_keluar_transaksiSchema = mongoose.Schema({
    no_faktur: {
        type: Number
    },
    total_bayar: {
        type: Number
    },
    status_transaksi: {
        type: String,
        default: "Belum dibayar"
    },
    tgl_transaksi_keluar: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
    collection: 'tbl_barang_keluar_transaksi',
    versionKey: false
});

module.exports = mongoose.model("Tbl_barang_keluar_transaksi", tbl_barang_keluar_transaksiSchema);