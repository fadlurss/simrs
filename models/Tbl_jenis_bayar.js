var mongoose = require("mongoose");

var tbl_jenis_bayarSchema = mongoose.Schema({
    jenis_bayar: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_jenis_bayar',
    versionKey: false
});

module.exports = mongoose.model("Tbl_jenis_bayar", tbl_jenis_bayarSchema);