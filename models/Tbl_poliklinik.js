var mongoose = require("mongoose");

var tbl_poliklinikSchema = mongoose.Schema({
    nama_poliklinik: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_poliklinik',
    versionKey: false
});

module.exports = mongoose.model("Tbl_poliklinik", tbl_poliklinikSchema);