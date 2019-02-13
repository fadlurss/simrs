var mongoose = require("mongoose");

var tbl_pj_riwayattindakanSchema = mongoose.Schema({
    id_riwayat_tindakan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_riwayattindakan'
    },
    id_dokter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_dokter'
    },
    id_pegawai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_pegawai'
    },
    keterangan: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_pj_riwayattindakan',
    versionKey: false
});

module.exports = mongoose.model("Tbl_pj_riwayattindakan", tbl_pj_riwayattindakanSchema);