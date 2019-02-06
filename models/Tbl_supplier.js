var mongoose = require("mongoose");

var tbl_supplierSchema = mongoose.Schema({
    nama_supplier: {
        type: String
    },
    alamat: {
        type: String
    },
    no_telepon: {
        type: Number
    }
}, {
    timestamps: true,
    collection: 'tbl_supplier',
    versionKey: false
});

module.exports = mongoose.model("Tbl_supplier", tbl_supplierSchema);