var mongoose = require("mongoose");

var LectureSchema = new mongoose.Schema({
    name: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
    background : [String],
    message_log : [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text : String,
        doodle: [{
            x_value: Number,
            y_value: Number
        }]
    }]
});

module.exports = mongoose.model("Lecture", LectureSchema);
