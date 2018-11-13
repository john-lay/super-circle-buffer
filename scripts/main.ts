/// <reference path="model.ts" />
/// <reference path="direction.ts" />
/// <reference path="utility.ts" />
/// <reference path="qcf+p.ts" />

class SuperCircleBuffer {
    fps = 60;
    frameCount = 0;

    backPressed = false;
    towardPressed = false;
    downPressed = false;
    upPressed = false;

    readonly BACK_KEY = 37;
    readonly UP_KEY = 38;
    readonly TOWARD_KEY = 39;
    readonly DOWN_KEY = 40;

    readonly JAB_KEY = 100;
    readonly STRONG_KEY = 101;
    readonly FIERCE_KEY = 102;

    readonly SHORT_KEY = 97;
    readonly FORWARD_KEY = 98;
    readonly ROUNDHOUSE_KEY = 99;

    inputBuffer: IInput[] = [];
    specialMoves: String[] = [];
    container: HTMLElement = document.getElementById("Container");

    backChargeStartAt = 0;
    backChargeEndAt = 0;

    utility: Utility;
    fireball: Fireball;

    constructor() {
        // increment framecount every 1/60th of a second (assuming 60fps)
        setInterval(() => { this.frameCount++; }, 1000 / this.fps);

        this.utility = new Utility;
        this.fireball = new Fireball;
    }

    keyup = document.onkeydown = (e) => {
        (<any>e) = e || window.event;
        //console.log("key down = ", e.keyCode);

        if (e.keyCode === this.BACK_KEY && !this.backPressed) {
            this.backPressed = true;
            this.backChargeStartAt = this.frameCount;
        }

        if (e.keyCode === this.TOWARD_KEY && !this.towardPressed) {
            this.towardPressed = true;
        }

        if (e.keyCode === this.DOWN_KEY && !this.downPressed) {
            this.downPressed = true;
        }

        if (e.keyCode === this.UP_KEY && !this.upPressed) {
            this.upPressed = true;
        }
    }

    keydown = document.onkeyup = (e) => {
        (<any>e) = e || window.event;
        //console.log("key up = ", e.keyCode);

        if (e.keyCode === this.DOWN_KEY) {
            this.downPressed = false;
            this.addInput(direction.down);

            if (this.backPressed) this.addInput(direction.downBack);
            if (this.towardPressed) this.addInput(direction.downToward);
        }

        if (e.keyCode === this.UP_KEY) {
            this.upPressed = false;
            this.addInput(direction.up);

            if (this.backPressed) this.addInput(direction.upBack);
            if (this.towardPressed) this.addInput(direction.upToward);
        }

        if (e.keyCode === this.BACK_KEY) {
            this.backPressed = false;
            this.backChargeEndAt = this.frameCount;
            //console.log("back charged for = ", backChargeEndAt - backChargeStartAt);
            this.addInput(direction.back);

            if (this.downPressed) this.addInput(direction.downBack);
            if (this.upPressed) this.addInput(direction.upBack);
        }

        if (e.keyCode === this.TOWARD_KEY) {
            this.towardPressed = false;
            this.addInput(direction.toward);

            if (this.downPressed) this.addInput(direction.downToward);
            if (this.upPressed) this.addInput(direction.upToward);
        }

        // only add attack keys on key up
        // TODO: find out how to handle negative edge
        if (e.keyCode === this.JAB_KEY) this.addInput(direction.jab);
        if (e.keyCode === this.STRONG_KEY) this.addInput(direction.strong);
        if (e.keyCode === this.FIERCE_KEY) this.addInput(direction.fierce);

        if (e.keyCode === this.SHORT_KEY) this.addInput(direction.short);
        if (e.keyCode === this.FORWARD_KEY) this.addInput(direction.forward);
        if (e.keyCode === this.ROUNDHOUSE_KEY) this.addInput(direction.roundhouse);
    }

    /**
     * Add's a direction to the input buffer and calls 2 subsequent methods:
     * checkBuffer and drawBuffer
     * 
     * @param direction Indicate which direction to add
     */
    public addInput(direction: IDirection) {
        // update buffer
        this.inputBuffer.push({ notation: direction.notation, frame: this.frameCount });

        // check for special moves
        this.checkBuffer();

        // update UI
        this.drawInput(direction.alias);
    }

    /**
     * Creates a HTML element with a css class representing the input
     * 
     * @param directionName Indicate which direction to draw
     */
    public drawInput(directionName: string) {
        var node = document.createElement("div");
        node.className = "icon " + directionName;

        if (this.container !== null) {
            this.container.appendChild(node);
        }
    }

    /**
     * Iterate over the input buffer and look for special moves
     */
    public checkBuffer() {
        if(this.fireball.check(this.inputBuffer)) this.flushBuffer();
        for (var i = 0; i < this.inputBuffer.length; i++) {
            //this.checkForFireball(i);
            this.checkForSonicBoom(i);
            this.checkForHundredHandSlap(i);
        }
    }

    /**
     * Reset the input buffer and clear the visual representation from the DOM
     */
    public flushBuffer = () => {
        this.inputBuffer = [];
        if (this.container !== null) {
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        }
    }

    /**
     * To produce the jab hadoken:
     * 1. The first input must be down AND
     * 2. The second input must be down-towards AND down-towards must be pressed 
     *    within 6 frames of down AND
     * 3. The third input must be towards AND towards must be pressed within 6 
     *    frames of down-towards AND
     * 4. The fourth input must be jab AND jab must be pressed within 6 frames 
     *    of towards
     *
     * @param i Indicates the index of the input buffer
     */
    public checkForFireball(i: number) {
        // check for 4 input special moves 
        if (i + 3 < this.inputBuffer.length) {
            if (this.inputBuffer[i].notation === direction.down.notation &&
                this.inputBuffer[i + 1].notation === direction.downToward.notation &&
                (this.inputBuffer[i + 1].frame - this.inputBuffer[i].frame) <= 6 &&
                this.inputBuffer[i + 2].notation === direction.toward.notation &&
                (this.inputBuffer[i + 2].frame - this.inputBuffer[i + 1].frame) <= 6 &&
                this.utility.checkForPunch(this.inputBuffer[i + 3].notation) &&
                (this.inputBuffer[i + 3].frame - this.inputBuffer[i + 2].frame) <= 6) {
                console.log(`(${this.utility.punchStrength(this.inputBuffer[i + 3].notation)}) Hadoken!`);
                this.specialMoves.push(`(${this.utility.punchStrength(this.inputBuffer[i + 3].notation)}) Hadoken!`);
                this.flushBuffer();
            }
        }
    }

    /**
     * To produce the jab sonic boom:
     * 1. The first input must be back AND
     * 2. The time between holding and releasing back must be at least 1 second. 
     *    As we set fps (to 60), this can be used as our unit representing a second AND
     * 3. There must be at least 1 frame and no more than 7 (inclusive) frames between 
     *    the back being released and the toward input AND
     * 4. The first input after the towards must be a jab AND jab must be pressed
     *    within 6 frames of towards
     *
     * @param i Indicates the index of the input buffer
     */
    public checkForSonicBoom(i: number) {
        // check for charge special moves
        if (i + 1 < this.inputBuffer.length) {

            if (this.backChargeEndAt - this.backChargeStartAt >= this.fps &&
                this.inputBuffer[i].notation === direction.toward.notation &&
                this.inputBuffer[i].frame - this.backChargeEndAt > 0 && // wait at least 1 frame after charging 
                this.inputBuffer[i].frame - this.backChargeEndAt <= 7 && // but no more than 7 frames
                this.utility.checkForPunch(this.inputBuffer[i + 1].notation) &&
                (this.inputBuffer[i + 1].frame - this.inputBuffer[i].frame) <= 11) { // 11 frame window for jab sonic boom
                console.log(`(${this.utility.punchStrength(this.inputBuffer[i + 1].notation)}) sonic boom!`);
                this.flushBuffer();
            }
        }
    }

    /**
     * To produce the jab hundred hand slap:
     * 1. Input 5 consecutive jabs AND
     * 2. Each consecutive jab must be pressed within 11 frames of the previous one.
     * 
     * note: I struggled to find documentation to support this logic, unlike in
     * later games (i.e. Street Fighter IV) you cannot press a combination of 
     * punches. Also the frame leniency was guessed based on experience. I believe
     * The strong and fierce versions of the same move, require tighter input.
     * 
     * @param i Indicates the index of the input buffer
     */
    public checkForHundredHandSlap(i: number) {
        // check for rapid fire special moves
        if (i + 4 < this.inputBuffer.length) {

            if (this.utility.checkForPunch(this.inputBuffer[i].notation) &&
                this.utility.checkForPunch(this.inputBuffer[i + 1].notation) &&
                (this.inputBuffer[i + 1].frame - this.inputBuffer[i].frame) <= 11 &&
                this.utility.checkForPunch(this.inputBuffer[i + 2].notation) &&
                (this.inputBuffer[i + 2].frame - this.inputBuffer[i + 1].frame) <= 11 &&
                this.utility.checkForPunch(this.inputBuffer[i + 3].notation) &&
                (this.inputBuffer[i + 3].frame - this.inputBuffer[i + 2].frame) <= 11 &&
                this.utility.checkForPunch(this.inputBuffer[i + 4].notation) &&
                (this.inputBuffer[i + 4].frame - this.inputBuffer[i + 3].frame) <= 11) {
                console.log(`(${this.utility.punchStrength(this.inputBuffer[i + 4].notation)}) Hundred Hand Slap!`);

                this.flushBuffer();
            }
        }
    }
}

// initialise super circle buffer
let superCircleBuffer = new SuperCircleBuffer();