var mongoose = require("mongoose");

var tbl_pegawaiSchema = mongoose.Schema({
    nip: {
        type: Number
    },
    nama_pegawai: {
        type: String
    },
    jenis_kelamin: {
        type: String
    },
    npwp: {
        type: String
    },
    jenjang_pendidikan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_jenjang_pendidikan'
    },
    tempat_lahir: {
        type: String
    },
    tanggal_lahir: {
        type: Date
    },
    jabatan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_jabatan'
    }
}, {
    timestamps: false,
    collection: 'tbl_pegawai',
    versionKey: false
});

module.exports = mongoose.model("Tbl_pegawai", tbl_pegawaiSchema);