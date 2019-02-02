var mongoose = require("mongoose");

var tbl_jenjangSchema = mongoose.Schema({
    nama_jenjang: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_jenjang',
    versionKey: false
});

module.exports = mongoose.model("Tbl_jenjang", tbl_jenjangSchema);