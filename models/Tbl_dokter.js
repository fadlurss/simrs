var mongoose = require('mongoose');
var tbl_dokterSchema = new mongoose.Schema({
    id_users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    nama_dokter: {
        type: String
    },
    jenis_kelamin: {
        type: String
    },
    tempat_lahir: {
        type: String
    },
    tanggal_lahir: {
        type: Date
    },
    agama: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_agama'
    },
    alamat: {
        type: String
    },
    no_hp: {
        type: String
    },
    status_menikah: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_status_menikah'
    },
    spesialis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_spesialis'
    },
    no_izin_praktek: {
        type: String
    },
    gaji_pokok: {
        type: Number
    },
    tarif_dokter: {
        type: Number
    }

}, {
    timestamps: false,
    collection: 'tbl_dokter',
    versionKey: false
});


module.exports = mongoose.model("Tbl_dokter", tbl_dokterSchema);