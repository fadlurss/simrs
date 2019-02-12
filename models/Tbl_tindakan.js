var mongoose = require("mongoose");

var tbl_tindakanSchema = mongoose.Schema({
    nama_tindakan: {
        type: String
    },
    jenis_tindakan: {
        type: String
    },
    kode_kategori_tindakan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_kategori_tindakan'
    },
    tarif: {
        type: Number
    },
    tindakan_oleh: {
        type: String
    },
    id_poliklinik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_poliklinik'
    }
}, {
    timestamps: true,
    collection: 'tbl_tindakan',
    versionKey: false
});

module.exports = mongoose.model("Tbl_tindakan", tbl_tindakanSchema);