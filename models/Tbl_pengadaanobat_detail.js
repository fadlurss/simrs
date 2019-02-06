var mongoose = require("mongoose");

var tbl_pengadaanobat_detailSchema = mongoose.Schema({
    id_barang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_obat_alkes_bhp'
    },
    qty: {
        type: String
    },
    id_pengadaanobat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_pengadaanobat'
    }
}, {
    timestamps: true,
    collection: 'tbl_pengadaanobat_detail',
    versionKey: false
});

module.exports = mongoose.model("Tbl_pengadaanobat_detail", tbl_pengadaanobat_detailSchema);