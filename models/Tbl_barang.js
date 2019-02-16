var mongoose = require("mongoose");

var tbl_barangSchema = mongoose.Schema({
    nama_barang: {
        type: String
    },
    stok: {
        type: Number
    },
    stok_minimum: {
        type: Number
    },
    harga_modal: {
        type: Number
    },
    harga_jual: {
        type: Number
    },
    id_kategori_barang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_kategori_barang'
    }
}, {
    timestamps: true,
    collection: 'tbl_barang',
    versionKey: false
});

module.exports = mongoose.model("Tbl_barang", tbl_barangSchema);