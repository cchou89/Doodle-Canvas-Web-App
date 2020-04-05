var socketIo = require('socket.io');
var Lecture = require('./models/lecture');

// array of all lines drawn
var line_history = [];

function init(server){
    var io = socketIo(server, {
        handlePreflightRequest: (req, res) => {
            const headers = {
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            };
            res.writeHead(200, headers);
            res.end();
        }
    });

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

                // first send the history to the new client
                for (var i in line_history) {
                    io.emit('draw_line', { line: line_history[i] } );
                }

                // add handler for message type "draw_line".
                client.on('draw_line', function (data) {
                    // add received line to history
                    line_history.push(data.line);
                    // send line to all clients
                    io.emit('draw_line', { line: data.line });
                });

                // clear canvas after clicking clear button
                client.on('clearit', function(){
                    line_history.length = 0;
                    io.emit('clearit', true);
                });
            });
        });
    });

    return io;
}
module.exports = init;
