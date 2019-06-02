var mongoose = require("mongoose");
var notificationSchema = new mongoose.Schema ({
    username: String,
    pendaftaran_id: String,
    isRead: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Notification", notificationSchema);