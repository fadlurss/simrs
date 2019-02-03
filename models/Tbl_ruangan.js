var mongoose = require("mongoose");

var tbl_ruanganSchema = mongoose.Schema({
    kode_ruang_rawat_inap: {
        type: String
    },
    kode_gedung_rawat_inap: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_gedung_rawat_inap'
    },
    nama_ruangan: {
        type: String
    },
    kelas: {
        type: String
    },
    tarif: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_ruang_rawat_inap',
    versionKey: false
});

module.exports = mongoose.model("Tbl_ruang_rawat_inap", tbl_ruanganSchema);