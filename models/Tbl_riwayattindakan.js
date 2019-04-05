var mongoose = require("mongoose");

var tbl_riwayattindakanSchema = mongoose.Schema({
    id_tindakan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_tindakan'
    },
    hasil_periksa: {
        type: String
    },
    perkembangan: {
        type: String
    },
    tanggal: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false,
    collection: 'tbl_riwayattindakan',
    versionKey: false
});

module.exports = mongoose.model("Tbl_riwayattindakan", tbl_riwayattindakanSchema);