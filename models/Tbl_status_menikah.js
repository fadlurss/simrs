var mongoose = require("mongoose");

var tbl_status_menikahSchema = mongoose.Schema({
    status_menikah: {
        type: String
    }

}, {
    timestamps: true,
    collection: 'tbl_status_menikah',
    versionKey: false
});


module.exports = mongoose.model("Tbl_status_menikah", tbl_status_menikahSchema);