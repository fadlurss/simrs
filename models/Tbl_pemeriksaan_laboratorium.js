var mongoose = require("mongoose");

var tbl_pemeriksaanlaboratoriumSchema = mongoose.Schema({
    kode_periksa: {
        type: String
    },
    nama_periksa: {
        type: String
    },
    tarif: {
        type: Number
    }
}, {
    timestamps: true,
    collection: 'tbl_pemeriksaan_laboratorium',
    versionKey: false
});

module.exports = mongoose.model("Tbl_pemeriksaan_laboratorium", tbl_pemeriksaanlaboratoriumSchema);