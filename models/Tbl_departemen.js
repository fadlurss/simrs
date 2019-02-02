var mongoose = require("mongoose");

var tbl_departemenSchema = mongoose.Schema({
    nama_departemen: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_departemen',
    versionKey: false
});

module.exports = mongoose.model("Tbl_departemen", tbl_departemenSchema);