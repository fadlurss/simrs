var mongoose = require("mongoose");

var tbl_bidangSchema = mongoose.Schema({
    nama_bidang: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_bidang',
    versionKey: false
});

module.exports = mongoose.model("Tbl_bidang", tbl_bidangSchema);