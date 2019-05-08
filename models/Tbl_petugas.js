var mongoose = require('mongoose');
var tbl_petugasSchema = new mongoose.Schema({
    id_users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    nama_petugas: {
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
    sk_pengangkatan: {
        type: String
    },
    gaji_pokok: {
        type: Number
    }

}, {
    timestamps: false,
    collection: 'tbl_petugas',
    versionKey: false
});


module.exports = mongoose.model("Tbl_petugas", tbl_petugasSchema);