var mongoose = require("mongoose");

var tbl_barang_keluarSchema = mongoose.Schema({
    total_keluar: {
        type: Number
    },
    harga_modal: {
        type: Number
    },
    harga_jual: {
        type: Number
    },
    id_barang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_barang'
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