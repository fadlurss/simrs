var mongoose = require("mongoose");

var tbl_pj_riwayatdiagnosaSchema = mongoose.Schema({
    id_riwayat_diagnosa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_riwayatdiagnosa'
    },
    id_dokter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_dokter'
    },
    dilakukan_oleh: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_pj_riwayatdiagnosa',
    versionKey: false
});

module.exports = mongoose.model("tbl_pj_riwayatdiagnosa", tbl_pj_riwayatdiagnosaSchema);