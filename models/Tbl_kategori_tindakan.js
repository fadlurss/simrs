var mongoose = require("mongoose");

var tbl_kategori_tindakanSchema = mongoose.Schema({
    kode_kategori_tindakan: {
        type: String
    },
    kategori_tindakan: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_kategori_tindakan',
    versionKey: false
});

module.exports = mongoose.model("Tbl_kategori_tindakan", tbl_kategori_tindakanSchema);