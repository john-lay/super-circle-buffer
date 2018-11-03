import { IDirections, IDirection, IInput } from "./model";

export class SuperCircleBuffer {
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

    inputBuffer: IInput[] = [];
    specialMoves: String[] = [];
    container: HTMLElement = document.getElementById("Container");

    backChargeStartAt = 0;
    backChargeEndAt = 0;

    // using japanese street fighter notation for direction
    // https://sonichurricane.com/articles/sfnotation.html
    readonly direction: IDirections = {
        downBack: { alias: 'dl', notation: 0x1, name: 'down-back' },
        down: { alias: 'd', notation: 0x2, name: 'down' },
        downToward: { alias: 'dr', notation: 0x3, name: 'down-toward' },
        back: { alias: 'l', notation: 0x4, name: 'back' },
        toward: { alias: 'r', notation: 0x6, name: 'toward' },
        upBack: { alias: 'ul', notation: 0x7, name: 'up-back' },
        up: { alias: 'u', notation: 0x8, name: 'up' },
        upToward: { alias: 'ur', notation: 0x9, name: 'up-toward' },

        jab: { alias: 'lp', notation: 0xA, name: 'jab' },
        strong: { alias: 'mp', notation: 0xB, name: 'strong' },
        fierce: { alias: 'hp', notation: 0xC, name: 'fierce' }
    }

    constructor() {
        // increment framecount every 1/60th of a second (assuming 60fps)
        setInterval(() => { this.frameCount++; }, 1000 / this.fps);
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
            this.addInput(this.direction.down);

            if (this.backPressed) this.addInput(this.direction.downBack);
            if (this.towardPressed) this.addInput(this.direction.downToward);
        }

        if (e.keyCode === this.UP_KEY) {
            this.upPressed = false;
            this.addInput(this.direction.up);

            if (this.backPressed) this.addInput(this.direction.upBack);
            if (this.towardPressed) this.addInput(this.direction.upToward);
        }

        if (e.keyCode === this.BACK_KEY) {
            this.backPressed = false;
            this.backChargeEndAt = this.frameCount;
            //console.log("back charged for = ", backChargeEndAt - backChargeStartAt);
            this.addInput(this.direction.back);

            if (this.downPressed) this.addInput(this.direction.downBack);
            if (this.upPressed) this.addInput(this.direction.upBack);
        }

        if (e.keyCode === this.TOWARD_KEY) {
            this.towardPressed = false;
            this.addInput(this.direction.toward);

            if (this.downPressed) this.addInput(this.direction.downToward);
            if (this.upPressed) this.addInput(this.direction.upToward);
        }

        // only add attack keys on key up
        // TODO: find out how to handle negative edge
        if (e.keyCode === this.JAB_KEY) {
            this.addInput(this.direction.jab);
        }

        if (e.keyCode === this.STRONG_KEY) {
            this.addInput(this.direction.strong);
        }

        if (e.keyCode === this.FIERCE_KEY) {
            this.addInput(this.direction.fierce);
        }
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
        for (var i = 0; i < this.inputBuffer.length; i++) {
            this.checkForFireball(i);
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
            if (this.inputBuffer[i].notation === this.direction.down.notation &&
                this.inputBuffer[i + 1].notation === this.direction.downToward.notation &&
                (this.inputBuffer[i + 1].frame - this.inputBuffer[i].frame) <= 6 &&
                this.inputBuffer[i + 2].notation === this.direction.toward.notation &&
                (this.inputBuffer[i + 2].frame - this.inputBuffer[i + 1].frame) <= 6 &&
                this.checkForPunch(this.inputBuffer[i + 3].notation) &&
                (this.inputBuffer[i + 3].frame - this.inputBuffer[i + 2].frame) <= 6) {
                console.log(`(${this.punchStrength(this.inputBuffer[i + 3].notation)}) Hadoken!`);
                this.specialMoves.push(`(${this.punchStrength(this.inputBuffer[i + 3].notation)}) Hadoken!`);
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
                this.inputBuffer[i].notation === this.direction.toward.notation &&
                this.inputBuffer[i].frame - this.backChargeEndAt > 0 && // wait at least 1 frame after charging 
                this.inputBuffer[i].frame - this.backChargeEndAt <= 7 && // but no more than 7 frames
                this.checkForPunch(this.inputBuffer[i + 1].notation) &&
                (this.inputBuffer[i + 1].frame - this.inputBuffer[i].frame) <= 11) { // 11 frame window for jab sonic boom
                console.log(`(${this.punchStrength(this.inputBuffer[i + 1].notation)}) sonic boom!`);
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

            if (this.checkForPunch(this.inputBuffer[i].notation) &&
                this.checkForPunch(this.inputBuffer[i + 1].notation) &&
                (this.inputBuffer[i + 1].frame - this.inputBuffer[i].frame) <= 11 &&
                this.checkForPunch(this.inputBuffer[i + 2].notation) &&
                (this.inputBuffer[i + 2].frame - this.inputBuffer[i + 1].frame) <= 11 &&
                this.checkForPunch(this.inputBuffer[i + 3].notation) &&
                (this.inputBuffer[i + 3].frame - this.inputBuffer[i + 2].frame) <= 11 &&
                this.checkForPunch(this.inputBuffer[i + 4].notation) &&
                (this.inputBuffer[i + 4].frame - this.inputBuffer[i + 3].frame) <= 11) {
                console.log(`(${this.punchStrength(this.inputBuffer[i + 4].notation)}) Hundred Hand Slap!`);
                
                this.flushBuffer();
            }
        }
    }

    private checkForPunch(notation: number): boolean {
        if (notation === this.direction.jab.notation ||
            notation === this.direction.strong.notation ||
            notation === this.direction.fierce.notation) {
            return true;
        }

        return false;
    }

    private punchStrength(notation: number): string {
        switch (notation) {
            case this.direction.jab.notation:
                return this.direction.jab.name;
            case this.direction.strong.notation:
                return this.direction.strong.name;
            case this.direction.fierce.notation:
                return this.direction.fierce.name;
            default: return ''
        }
    }
}

// initialise super circle buffer
let superCircleBuffer = new SuperCircleBuffer();