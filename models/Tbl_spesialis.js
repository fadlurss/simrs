var mongoose = require("mongoose");
var tbl_spesialisSchema = mongoose.Schema({
    nama_spesialis: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'tbl_spesialis',
    versionKey: false
});
module.exports = mongoose.model("Tbl_spesialis", tbl_spesialisSchema);