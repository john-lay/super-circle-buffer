var rightPressed = false;
var downPressed = false;

// var LEFT_KEY = 37;
// var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;

var inputBuffer = [];

// using japanese street fighter notation for direction
// https://sonichurricane.com/articles/sfnotation.html
var direction = {
    down: { name: 'd', notation: 2 },
    downRight: { name: 'dr', notation: 3 },
    right: { name: 'r', notation: 6 }
}

document.onkeydown = function(e) {
    e = e || window.event;
    console.log("key down = ", e.keyCode);

    switch(e.keyCode) {
        case RIGHT_KEY: 
            rightPressed = true;
        break;
        case DOWN_KEY: 
            downPressed = true;
        break;
    }
}

document.onkeyup = function(e) {
    e = e || window.event;
    console.log("key up = ", e.keyCode);

    if(e.keyCode === DOWN_KEY) {
        downPressed = false;
        addInput(direction.down);

        if(rightPressed) addInput(direction.downRight);        
    }

    if(e.keyCode === RIGHT_KEY) {
        rightPressed = false;
        addInput(direction.right);

        if(downPressed) addInput(direction.downRight);
    }
}

function addInput(direction) {
    // update buffer
    inputBuffer.push(direction.notation);
    
    // check for special moves
    checkBuffer();
    
    // update UI
    drawInput(direction.name);
}

function drawInput(directionName) {
    var node = document.createElement("div");
    node.className = "icon " + directionName;

    document.getElementById("Container").appendChild(node);
}

function checkBuffer() {
    for(var i=0; i<inputBuffer.length; i++) {
        // check for 3 direction special moves
        if(i+2 <= inputBuffer.length) {
            if(inputBuffer[i] === direction.down.notation &&
               inputBuffer[i+1] === direction.downRight.notation &&
               inputBuffer[i+2] === direction.right.notation) {
                    console.log('Hadoken!');
                }
        }
    }
}