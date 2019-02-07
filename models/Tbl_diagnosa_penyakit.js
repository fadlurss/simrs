var mongoose = require("mongoose");

var tbl_diagnosa_penyakitSchema = mongoose.Schema({
    kode_diagnosa: {
        type: String
    },
    nama_penyakit: {
        type: String
    },
    ciri_ciri_penyakit: {
        type: String
    },
    keterangan: {
        type: String
    },
    ciri_ciri_umum: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_diagnosa_penyakit',
    versionKey: false
});

module.exports = mongoose.model("Tbl_diagnosa_penyakit", tbl_diagnosa_penyakitSchema);