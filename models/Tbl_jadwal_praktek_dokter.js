var mongoose = require('mongoose');
var tbl_jadwal_praktek_dokterSchema = new mongoose.Schema({
    nama_dokter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_dokter'
    },
    hari: {
        type: String
    },
    jam_mulai: {
        type: String
    },
    jam_selesai: {
        type: String
    },
    poliklinik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_poliklinik'
    }

}, {
    timestamps: true,
    collection: 'tbl_jadwal_praktek_dokter',
    versionKey: false
});

module.exports = mongoose.model("Tbl_jadwal_praktek_dokter", tbl_jadwal_praktek_dokterSchema);