var mongoose = require("mongoose");

var tbl_gejala_pakarSchema = mongoose.Schema({
    kode_gejala: {
        type: String
    },
    nama_gejala: {
        type: String
    },
    bobot: {
        type: Number
    }
}, {
    timestamps: false,
    collection: 'tbl_gejala_pakar',
    versionKey: false
});

module.exports = mongoose.model("Tbl_gejala_pakar", tbl_gejala_pakarSchema);