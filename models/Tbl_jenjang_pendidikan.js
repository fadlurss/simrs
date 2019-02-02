var mongoose = require("mongoose");

var tbl_jenjang_pendidikanSchema = mongoose.Schema({
    nama_jenjang_pendidikan: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_jenjang_pendidikan',
    versionKey: false
});

module.exports = mongoose.model("Tbl_jenjang_pendidikan", tbl_jenjang_pendidikanSchema);