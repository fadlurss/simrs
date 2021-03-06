var mongoose = require("mongoose");
// TABEL RIWAYAT DIAGNOSA BERDASARKAN INPUTAN DOKTER
var tbl_riwayatdiagnosaSchema = mongoose.Schema({
    ds: {
        type: String
    },
    do: {
        type: String
    },
    keterangan: {
        type: String
    },
    tanggal: {
        type: Date,
        default: Date.now
    },
    id_riwayat_periksa_lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_hasil_periksa_lab'
    }
}, {
    timestamps: false,
    collection: 'tbl_riwayatdiagnosa',
    versionKey: false
});

module.exports = mongoose.model("Tbl_riwayatdiagnosa", tbl_riwayatdiagnosaSchema);