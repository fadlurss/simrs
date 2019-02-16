var mongoose = require("mongoose");

var tbl_golonganSchema = mongoose.Schema({
    nama_golongan_obat: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_golongan_obat',
    versionKey: false
});

module.exports = mongoose.model("Tbl_golongan_obat", tbl_golonganSchema);