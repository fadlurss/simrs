var mongoose = require("mongoose");

var tbl_gedungSchema = mongoose.Schema({
    nama_gedung: {
        type: String
    },
    kode_gedung_rawat_inap: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_gedung_rawat_inap',
    versionKey: false
});

module.exports = mongoose.model("Tbl_gedung_rawat_inap", tbl_gedungSchema);