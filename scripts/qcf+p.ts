/// <reference path="model.ts" />
/// <reference path="direction.ts" />
/// <reference path="utility.ts" />
/// <reference path="SpecialMove.ts" />

class Fireball extends SpecialMove {

    private utility: Utility;

    readonly inputLeniency: number = 6;
    readonly lightAttackLeniency: number = 10;
    readonly mediumAttackLeniency: number = 9;
    readonly highAttackLeniency: number = 7;
    
    constructor() {
        super();
        this.utility = new Utility;        
    }

    public check(inputBuffer: IInput[]): boolean {
        for (var i = 0; i < inputBuffer.length; i++) {
            if (i + 3 < inputBuffer.length) {
                if (inputBuffer[i].notation === direction.down.notation &&
                    inputBuffer[i + 1].notation === direction.downToward.notation &&
                    (inputBuffer[i + 1].frame - inputBuffer[i].frame) <= 6 &&
                    inputBuffer[i + 2].notation === direction.toward.notation &&
                    (inputBuffer[i + 2].frame - inputBuffer[i + 1].frame) <= 6 &&
                    this.utility.checkForPunch(inputBuffer[i + 3].notation) &&
                    (inputBuffer[i + 3].frame - inputBuffer[i + 2].frame) <= 6) {
                    console.log(`(${this.utility.punchStrength(inputBuffer[i + 3].notation)}) Hadoken!`);
                    //this.specialMoves.push(`(${this.utility.punchStrength(inputBuffer[i + 3].notation)}) Hadoken!`);
                    return true;
                }
            }
        }

        return false;
    }
}