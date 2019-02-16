var mongoose = require("mongoose");

var tbl_pengadaanobatSchema = mongoose.Schema({
    no_faktur: {
        type: String
    },
    tanggal: {
        type: Date,
        default: Date.now
    },
    id_supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_supplier'
    }
}, {
    timestamps: true,
    collection: 'tbl_pengadaanobat',
    versionKey: false
});

module.exports = mongoose.model("Tbl_pengadaanobat", tbl_pengadaanobatSchema);