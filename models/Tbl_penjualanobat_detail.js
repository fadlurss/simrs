var mongoose = require("mongoose");

var tbl_penjualanobat_detailSchema = mongoose.Schema({
    id_barang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_obat_alkes_bhp'
    },
    qty: {
        type: String
    },
    id_penjualanobat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_penjualanobat'
    }
}, {
    timestamps: true,
    collection: 'tbl_penjualanobat_detail',
    versionKey: false
});

module.exports = mongoose.model("Tbl_penjualanobat_detail", tbl_penjualanobat_detailSchema);