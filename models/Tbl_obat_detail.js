var mongoose = require("mongoose");

var tbl_obat_detailSchema = mongoose.Schema({
    merek_dagang: {
        type: String
    },
    manfaat: {
        type: String
    },
    dikonsumsi_oleh: {
        type: String
    },
    peringatan: {
        type: String
    },
    dosis: {
        type: String
    },
    cara_mengonsumsi: {
        type: String
    },
    interaksi_obat: {
        type: String
    },
    efek_samping: {
        type: String
    },
    id_obat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_obat_alkes_bhp'
    }
}, {
    timestamps: true,
    collection: 'tbl_obat_detail',
    versionKey: false
});

module.exports = mongoose.model("Tbl_obat_detail", tbl_obat_detailSchema);