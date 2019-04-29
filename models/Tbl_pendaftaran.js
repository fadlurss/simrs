var mongoose = require("mongoose");

var tbl_pendaftaranSchema = mongoose.Schema({
    no_registrasi: {
        type: Number
    },
    no_rawat: {
        type: String
    },
    id_pasien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_pasien'
    },
    tanggal_daftar: {
        type: String
    },
    id_dokter_penanggung_jawab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_dokter'
    },
    id_poliklinik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_poliklinik'
    },
    nama_penanggung_jawab: {
        type: String
    },
    hubungan_dengan_penanggung_jawab: {
        type: String
    },
    alamat_penanggung_jawab: {
        type: String
    },
    id_riwayattindakan: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_riwayattindakan'
    }],
    id_riwayatdiagnosa: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_riwayatdiagnosa'
    }]
}, {
    timestamps: true,
    collection: 'tbl_pendaftaran',
    versionKey: false
});

module.exports = mongoose.model("Tbl_pendaftaran", tbl_pendaftaranSchema);