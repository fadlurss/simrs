var mongoose = require("mongoose");

var tbl_diagnosa_pakarSchema = mongoose.Schema({
    kode_diagnosa: {
        type: String
    },
    nama_diagnosa: {
        type: String
    },
    keterangan: {
        type: String
    }
}, {
    timestamps: false,
    collection: 'tbl_diagnosa_pakar',
    versionKey: false
});

module.exports = mongoose.model("Tbl_diagnosa_pakar", tbl_diagnosa_pakarSchema);