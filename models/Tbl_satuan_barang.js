var mongoose = require("mongoose");

var tbl_satuan_barangSchema = mongoose.Schema({
    nama_satuan: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_satuan_barang',
    versionKey: false
});

module.exports = mongoose.model("Tbl_satuan_barang", tbl_satuan_barangSchema);