var mongoose = require("mongoose");

var tbl_barang_masukSchema = mongoose.Schema({
    status_transaksi: {
        type: String
    },
    status_penerimaan: {
        type: String,
        default: "Belum"
    },
    hutang: {
        type: Number
    },
    total_bayar: {
        type: Number
    },
    total_masuk: {
        type: Number
    },
    total_diterima: {
        type: Number,
        default: 0
    },
    id_barang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_barang'
    },
    id_supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_supplier'
    },
    tgl_transaksi_masuk: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
    collection: 'tbl_barang_masuk',
    versionKey: false
});

module.exports = mongoose.model("Tbl_barang_masuk", tbl_barang_masukSchema);