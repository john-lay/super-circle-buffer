import { IDirections, IDirection, IInput } from "./model";

var fps = 60;
var frameCount = 0;

var backPressed = false;
var forwardPressed = false;
var downPressed = false;

var BACK_KEY = 37;
// var UP_KEY = 38;
var FORWARD_KEY = 39;
var DOWN_KEY = 40;
var JAB_KEY = 100;

var inputBuffer: IInput[] = [];
var container: HTMLElement = document.getElementById("Container");

var backChargeStartAt = 0;
var backChargeEndAt = 0;

// using japanese street fighter notation for direction
// https://sonichurricane.com/articles/sfnotation.html
var direction: IDirections = {
    down: { alias: 'd', notation: 2 },
    downForward: { alias: 'dr', notation: 3 },
    back: { alias: 'l', notation: 4 },
    forward: { alias: 'r', notation: 6 },

    jab: { alias: 'lp', notation: 10 }
}

document.onkeydown = function(e) {
    (<any>e) = e || window.event;
    console.log("key down = ", e.keyCode);

    if(e.keyCode === BACK_KEY && !backPressed) {
        backPressed = true;
        backChargeStartAt = frameCount;
    }

    if(e.keyCode === FORWARD_KEY && !forwardPressed) {
        forwardPressed = true;
    }

    if(e.keyCode === DOWN_KEY && !downPressed) {
        downPressed = true;
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

    if(e.keyCode === BACK_KEY) {
        backPressed = false;
        backChargeEndAt = frameCount;
        console.log("back charged for = ", backChargeEndAt - backChargeStartAt);
        addInput(direction.back);

        if(downPressed) addInput(direction.downForward);
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
    inputBuffer.push({notation: direction.notation, frame: frameCount});
    console.log(inputBuffer);
    // check for special moves
    checkBuffer();
    
    // update UI
    drawInput(direction.alias);
}

function drawInput(directionName: string) {
    var node = document.createElement("div");
    node.className = "icon " + directionName;

    container.appendChild(node);
}

function checkBuffer() {
    for(var i=0; i<inputBuffer.length; i++) {
        // check for 4 input special moves 
        if(i+3 < inputBuffer.length) {
            /**
             * To produce the jab hadoken:
             * 1. The first input must be down AND
             * 2. The second input must be down-forwards AND down-forwards must be pressed within 6 frames of down AND
             * 3. The third input must be forwards AND forwards must be pressed within 6 frames of down-forwards AND
             * 4. The fourth input must be jab AND jab must be pressed within 6 frames of forwards
             */
            if(inputBuffer[i].notation === direction.down.notation &&
               inputBuffer[i+1].notation === direction.downForward.notation && (inputBuffer[i+1].frame - inputBuffer[i].frame) <= 6 &&
               inputBuffer[i+2].notation === direction.forward.notation && (inputBuffer[i+2].frame - inputBuffer[i+1].frame) <= 6 &&
               inputBuffer[i+3].notation === direction.jab.notation && (inputBuffer[i+3].frame - inputBuffer[i+2].frame) <= 6) {
                    console.log('(Jab) Hadoken!'); 
                    flushBuffer();
                }
        }

        // check for charge special moves
        if(i+1 < inputBuffer.length) {
            /**
             * To produce the jab sonic boom:
             * 1. The first input must be back AND
             * 2. The time between holding and releasing back must be at least 1 second. As we set fps (to 60), this can be used as our unit representing a second AND
             * 3. There must be at least 1 frame and no more than 7 (inclusive) frames between the back being released and the forward input AND
             * 4. The first input after the forwards must be a jab AND jab must be pressed within 6 frames of forwards
             */
            if(backChargeEndAt - backChargeStartAt >= fps &&
                inputBuffer[i].notation === direction.forward.notation &&
                inputBuffer[i].frame - backChargeEndAt > 0 && // wait at least 1 frame after charging 
                inputBuffer[i].frame - backChargeEndAt <= 7 && // but no more than 7 frames
                inputBuffer[i+1].notation === direction.jab.notation &&
                (inputBuffer[i+1].frame - inputBuffer[i].frame) <= 11) { // 11 frame window for jab sonic boom
                    console.log('(Jab) sonic boom!'); 
                    flushBuffer();    
                }
        }
    }
}

function flushBuffer() {
    inputBuffer = [];
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// increment framecount every 1/60th of a second (assuming 60fps)
setInterval(() => {frameCount++;}, 1000 / fps);
