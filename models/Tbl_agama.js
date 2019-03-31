var mongoose = require("mongoose");

var tbl_agamaSchema = mongoose.Schema({
    nama_agama: {
        type: String
    }
}, {
    timestamps: false,
    collection: 'tbl_agama',
    versionKey: false
});

module.exports = mongoose.model("Tbl_agama", tbl_agamaSchema);