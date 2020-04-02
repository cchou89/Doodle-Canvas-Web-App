var socketIo = require('socket.io');
var Lecture = require('./models/lecture');

function init(server){
    var io = socketIo(server);

    io.on('connection', function(client){
        console.log('a user is connected');
        client.on('disconnect', function () {
            console.log('a user is disconnected');
        });
        Lecture.find({}, function (error, list){
            list.forEach(function (lecture){
                 client.on(lecture._id, function (message) {
                     console.log('a user sent this message ' + message);
                     io.emit(lecture._id, message);
                });
            });
        });
    });
    return io;
}
module.exports = init;
