
function extractURL() {
    var url = window.location.href;
    var paths = url.split('/');
    var namespace = paths[paths.length-1];
    if(namespace === ""){
        namespace = '/';
    }
    return namespace;
}

$(function () {
    var id = extractURL();

    var socket = io(); // io without an argument will auto discover

    $('form').submit(function(){
        socket.emit(id, $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on(id, function(msg){
        $('#messages').append($('<li>').text(msg));
        // window.scrollTo(0, document.body.scrollHeight);
    });
});

