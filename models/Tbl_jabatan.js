var mongoose = require("mongoose");

var tbl_jabatanSchema = mongoose.Schema({
    nama_jabatan: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_jabatan',
    versionKey: false
});

module.exports = mongoose.model("Tbl_jabatan", tbl_jabatanSchema);