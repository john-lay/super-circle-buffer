var rightPressed = false;
var downPressed = false;

var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

document.onkeydown = function(e) {
    e = e || window.event;
    console.log("key down = ", e.keyCode);

    switch(e.keyCode) {
        case RIGHT: 
            rightPressed = true;
        break;
        case DOWN: 
            downPressed = true;
        break;
    }
}

document.onkeyup = function(e) {
    e = e || window.event;
    console.log("key up = ", e.keyCode);

    if(e.keyCode === DOWN) {
        downPressed = false;
        showInput('d');

        if(rightPressed) showInput('dr');        
    }

    if(e.keyCode === RIGHT) {
        rightPressed = false;
        showInput('r');

        if(downPressed) showInput('dr');
    }
}

function showInput(direction) {
    var node = document.createElement("div");
    node.className = "icon " + direction;

    document.getElementById("Container").appendChild(node);
}