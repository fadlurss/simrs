var mongoose = require("mongoose");

var tbl_riwayatberiobatSchema = mongoose.Schema({
    id_obat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_obat_alkes_bhp'
    },
    qty: {
        type: Number
    },
    tanggal: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'tbl_riwayatberiobat',
    versionKey: false
});

module.exports = mongoose.model("Tbl_riwayatberiobat", tbl_riwayatberiobatSchema);