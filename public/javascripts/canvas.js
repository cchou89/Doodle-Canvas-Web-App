// Check for the canvas tag onload.
var context;
var canvas, canvasContainer, contexto;
var background_file, imageContainer, maxWidth, minHeight;
// Default tool. (chalk, line, rectangle)
var tool;
var tool_default = 'chalk';
var tools = {};
/* line color and width variables */
var lineColor = "black";
var lineWidth = 5;


// start doodle button, adds the doodle script
var startDoodle;

/*<------Tools------>*/
// Chalk tool.
tools.chalk = function () {
    var tool = this;
    this.started = false;
    // Begin drawing with the chalk tool.
    this.mousedown = function (ev) {
        context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    };
    this.mousemove = function (ev) {
        if (tool.started) {
            context.lineTo(ev._x, ev._y);
            context.stroke();
            // printMousePos(ev);
        }
    };
    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
    this.mouseleave = function (ev) {
        if (tool.started) {
            tool.mouseup(ev);
        }
    };
    this.touchstart = function (ev) {
        tool.mousedown(ev);
    };
    this.touchmove = function (ev) {
        tool.mousemove(ev);
    };
    this.touchend = function (ev) {
        tool.mouseup(ev);
    };
};

//<------line Color and Width Setup------>//

var lineWidth_select= document.getElementById('lineWidth');
if (lineWidth_select) {
    lineWidth_select.addEventListener('change', function (event) {
        lineWidth = lineWidth_select.value;
        toolChange();
    });
}
var lineColor_select= document.getElementById('lineColor');
if (lineColor_select) {
    lineColor_select.addEventListener('change', function (event) {
        lineColor = lineColor_select.value;
        toolChange();
    });
}

window.addEventListener('load', startCanvas);
window.addEventListener('load', listenToButton);

/* Add the event listener only after the start-doodle button in clicked
* Start-doodle is only shown to the owner of a lecture */
function listenToButton() {
    /* start doodle button */
    startDoodle = document.getElementById('start-doodle');
    if(startDoodle){
        startDoodle.addEventListener('click', doodle);
    }
}
function doodle() {
        // Event Listeners.
        //local client events
        canvas.addEventListener('mousedown', ev_canvas, false);
        canvas.addEventListener('mousemove', ev_canvas, false);
        canvas.addEventListener('mouseup',   ev_canvas, false);
        canvas.addEventListener('mouseleave', ev_canvas, false);
        //add touch input
        canvas.addEventListener('touchstart', ev_canvas, false);
        canvas.addEventListener('touchend', ev_canvas, false);
        canvas.addEventListener('touchmove', ev_canvas, false);


}

function startCanvas() {
    setupCanvas();
    addTempCanvas();
    activatePen();
}
function toolChange() {
    addTempCanvas();
    activatePen();
    doodle();
}
function setupCanvas () {

    //<------Canvas Setup------>//
    canvasContainer = document.getElementById('drawingCanvas');
    if (!canvasContainer) {
        alert('Error! The canvas element was not found!');
        return;
    }
    // Create 2d canvas.
    contexto = canvasContainer.getContext('2d');
    if (!contexto) {
        alert('Error! Failed to getContext!');
        return;
    }

    /* adding background image */
    background_file = document.getElementById("background_file");
    imageContainer = document.querySelector('#drawingColumn');
    maxWidth = background_file.width;
    minHeight = background_file.height;
    if (imageContainer.clientWidth < background_file.width) {
        maxWidth = imageContainer.clientWidth;
        minHeight = minHeight * maxWidth / background_file.width;
    }
    imageContainer.clientHeight = minHeight;
    contexto.canvas.width = maxWidth;
    contexto.canvas.height = minHeight;

    /* Draw the image into the canvas */
    contexto.drawImage(background_file, 0, 0, maxWidth, minHeight);
}
function addTempCanvas() {
    // Build the temporary canvas.
    var container = canvasContainer.parentNode;
    canvas = document.createElement('canvas');
    if (!canvas) {
        alert('Error! Cannot create a new canvas element!');
        return;
    }

    canvas.id = 'tempCanvas';
    canvas.width  = maxWidth;
    canvas.height = minHeight;
    container.appendChild(canvas);
    context = canvas.getContext('2d');
    context.strokeStyle = lineColor;// Default line color.
    context.lineWidth = lineWidth;// Default stroke weight.
    // Fill transparent canvas with dark grey (So we can use the color to erase).
    /* Damoon: I added globalAlpha for debugging*/
    // context.fillStyle = "#424242";
    // context.globalAlpha=0.2;
    // context.fillRect(0,0,maxWidth, minHeight);//Top, Left, Width, Height of canvas.
}


function activatePen() {

    //<------Selector Setup------>//

    // Create a select field with our tools
    // var tool_select = document.getElementById('selector');
    // if (!tool_select) {
    //     alert('Error! Failed to get the select element!');
    //     return;
    // }
    // tool_select.addEventListener('change', ev_tool_change, false);

    // Activate the default tool (chalk).
    if (tools[tool_default]) {
        tool = new tools[tool_default];
        // tool_select.value = tool_default;
    }

}
// Get the mouse position.
function ev_canvas (ev) {
    if (ev.layerX || ev.layerX === 0) { // Firefox
        ev._x = ev.layerX;
        ev._y = ev.layerY;
    }
    else if (ev.offsetX || ev.offsetX === 0) { // Opera
        ev._x = ev.offsetX;
        ev._y = ev.offsetY;
    }
    // Get the tool's event handler.
    var func = tool[ev.type];
    if (func) {
        func(ev);
    }
}

function ev_tool_change () {
    if (tools[this.value]) {
        tool = new tools[this.value]();
    }
}

// Create the temporary canvas on top of the canvas, which is cleared each time the user draws.
function img_update () {
    contexto.drawImage(canvas, 0, 0, maxWidth, minHeight);
    context.clearRect(0, 0 ,maxWidth, minHeight);
}

// Debug
function printMousePos(event) {
    console.log("clientX: " + event.clientX);
    console.log("clientY: " + event.clientY);
}
