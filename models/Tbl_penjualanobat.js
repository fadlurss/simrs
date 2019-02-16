var mongoose = require("mongoose");

var tbl_penjualanobatSchema = mongoose.Schema({
    no_faktur: {
        type: String
    },
    tanggal: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'tbl_penjualanobat',
    versionKey: false
});

module.exports = mongoose.model("Tbl_penjualanobat", tbl_penjualanobatSchema);