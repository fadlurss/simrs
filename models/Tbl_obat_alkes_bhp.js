var mongoose = require("mongoose");

var tbl_obat_alkes_bhpSchema = mongoose.Schema({
    nama_barang: {
        type: String
    },
    id_kategori_barang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_kategori_barang'
    },
    id_satuan_barang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_satuan_barang'
    },
    id_golongan_obat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_golongan_obat'
    },
    stok: {
        type: String
    },
    harga: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_obat_alkes_bhp',
    versionKey: false
});

module.exports = mongoose.model("Tbl_obat_alkes_bhp", tbl_obat_alkes_bhpSchema);