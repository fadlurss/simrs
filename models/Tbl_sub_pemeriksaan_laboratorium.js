var mongoose = require("mongoose");

var tbl_sub_pemeriksaanlaboratoriumSchema = mongoose.Schema({
    kode_sub_periksa: {
        type: String
    },
    kode_periksa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_pemeriksaan_laboratorium'
    },
    nama_pemeriksaan: {
        type: String
    },
    satuan: {
        type: String
    },
    nilai_rujukan: {
        type: Number
    }
}, {
    timestamps: true,
    collection: 'tbl_sub_pemeriksaan_laboratorium',
    versionKey: false
});

module.exports = mongoose.model("Tbl_sub_pemeriksaan_laboratorium", tbl_sub_pemeriksaanlaboratoriumSchema);