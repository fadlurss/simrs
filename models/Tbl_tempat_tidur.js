var mongoose = require("mongoose");

var tbl_tempat_tidurSchema = mongoose.Schema({
    kode_tempat_tidur: {
        type: String
    },
    kode_ruang_rawat_inap: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tbl_ruang_rawat_inap'
    },
    status: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_tempat_tidur',
    versionKey: false
});

module.exports = mongoose.model("Tbl_tempat_tidur", tbl_tempat_tidurSchema);