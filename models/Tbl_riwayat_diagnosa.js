var mongoose = require("mongoose");

var tbl_riwayat_diagnosaSchema = mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    persentansi: {
        type: String
    },
    nama_diagnosa: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_riwayat_diagnosa',
    versionKey: false
});

module.exports = mongoose.model("Tbl_riwayat_diagnosa", tbl_riwayat_diagnosaSchema);