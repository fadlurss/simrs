var mongoose = require("mongoose");

var tbl_kategori_barangSchema = mongoose.Schema({
    nama_kategori: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_kategori_barang',
    versionKey: false
});

module.exports = mongoose.model("Tbl_kategori_barang", tbl_kategori_barangSchema);