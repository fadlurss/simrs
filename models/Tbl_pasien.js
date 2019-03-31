var mongoose = require("mongoose");
var moment = require('moment');

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
    },
    jenis_kelamin: {
        type: String
    },
    agama: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_agama'
    },
    status_menikah: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_status_menikah'
    }
}, {
    timestamps: true,
    collection: 'tbl_pasien',
    versionKey: false
});
// const date = ISODate(tanggal_lahir);
// const formattedDate = moment(date).format('DD-MM-YYYY');
module.exports = mongoose.model("Tbl_pasien", tbl_pasienSchema);