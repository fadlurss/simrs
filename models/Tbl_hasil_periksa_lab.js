var mongoose = require("mongoose");

var tbl_hasil_periksa_labSchema = mongoose.Schema({

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
    },
    id_pasien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_pasien'
    },
    alamat_pasien: {
        type: String
    },
    tanggal_periksa: {
        type: Date,
        default: Date.now
    },
    jenis_pemeriksaan: {
        type: String
    },
    hasil_pemeriksaan: {
        type: String
    },
    satuan: {
        type: String
    },
    nilai_rujukan: {
        type: String
    }
}, {
    timestamps: false,
    collection: 'tbl_hasil_periksa_lab',
    versionKey: false
});

module.exports = mongoose.model("Tbl_hasil_periksa_lab", tbl_hasil_periksa_labSchema);