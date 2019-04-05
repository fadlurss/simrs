var mongoose = require("mongoose");

var tbl_relasi_pakarSchema = mongoose.Schema({
    kode_relasi_pakar: {
        type: String
    },
    kode_gejala_pakar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_gejala_pakar'
    },
    kode_diagnosa_pakar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_diagnosa_pakar'
    }
}, {
    timestamps: false,
    collection: 'tbl_relasi_pakar',
    versionKey: false
});

module.exports = mongoose.model("Tbl_relasi_pakar", tbl_relasi_pakarSchema);