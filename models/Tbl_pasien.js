var mongoose = require("mongoose");

var tbl_pasienSchema = mongoose.Schema({
    no_rm: {
        type: Number
    },
    no_rm_lama: {
        type: Number
    },
    nama_pasien: {
        type: String
    },
    awal_berobat: {
        type: Date
    },
    tanggal_lahir: {
        type: Date
    },
    umur: {
        type: Number
    },
    alamat: {
        type: String
    },
    pekerjaan: {
        type: String
    },
    no_hp: {
        type: Number
    }

}, {
    timestamps: true,
    collection: 'tbl_pasien',
    versionKey: false
});

module.exports = mongoose.model("Tbl_pasien", tbl_pasienSchema);