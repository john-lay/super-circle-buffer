import { IDirections, IDirection } from "./model";

var forwardPressed = false;
var downPressed = false;

// var BACK_KEY = 37;
// var UP_KEY = 38;
var FORWARD_KEY = 39;
var DOWN_KEY = 40;
var JAB_KEY = 100;
var inputBuffer: number[] = [];

// using japanese street fighter notation for direction
// https://sonichurricane.com/articles/sfnotation.html
var direction: IDirections = {
    down: { alias: 'd', notation: 2 },
    downForward: { alias: 'dr', notation: 3 },
    forward: { alias: 'r', notation: 6 },

    jab: { alias: 'lp', notation: 10 }
}

document.onkeydown = function(e) {
    (<any>e) = e || window.event;
    console.log("key down = ", e.keyCode);

    switch(e.keyCode) {
        case FORWARD_KEY: 
            forwardPressed = true;
        break;
        case DOWN_KEY: 
            downPressed = true;
        break;
    }
}

document.onkeyup = function(e) {
    (<any>e) = e || window.event;
    console.log("key up = ", e.keyCode);

    if(e.keyCode === DOWN_KEY) {
        downPressed = false;
        addInput(direction.down);

        if(forwardPressed) addInput(direction.downForward);
    }

    if(e.keyCode === FORWARD_KEY) {
        forwardPressed = false;
        addInput(direction.forward);

        if(downPressed) addInput(direction.downForward);
    }

    // only add attack keys on key up
    // TODO: find out how to handle negative edge
    if(e.keyCode === JAB_KEY) {
        addInput(direction.jab);
    }
}

function addInput(direction: IDirection) {
    // update buffer
    inputBuffer.push(direction.notation);
    
    // check for special moves
    checkBuffer();
    
    // update UI
    drawInput(direction.alias);
}

function drawInput(directionName: string) {
    var node = document.createElement("div");
    node.className = "icon " + directionName;

    document.getElementById("Container").appendChild(node);
}

function checkBuffer() {
    for(var i=0; i<inputBuffer.length; i++) {
        // check for 4 input special moves 
        if(i+3 <= inputBuffer.length) {
            if(inputBuffer[i] === direction.down.notation &&
               inputBuffer[i+1] === direction.downForward.notation &&
               inputBuffer[i+2] === direction.forward.notation &&
               inputBuffer[i+3] === direction.jab.notation) {
                    console.log('(Jab) Hadoken!');
                }
        }
    }
}