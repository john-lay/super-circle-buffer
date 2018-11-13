/// <reference path="direction.ts" />

class Utility {
    constructor() { }

    public checkForPunch(notation: number): boolean {
        if (notation === direction.jab.notation ||
            notation === direction.strong.notation ||
            notation === direction.fierce.notation) {
            return true;
        }

        return false;
    }

    public punchStrength(notation: number): string {
        switch (notation) {
            case direction.jab.notation:
                return direction.jab.name;
            case direction.strong.notation:
                return direction.strong.name;
            case direction.fierce.notation:
                return direction.fierce.name;
            default:
                return '';
        }
    }

    public checkForKick(notation: number): boolean {
        if (notation === direction.short.notation ||
            notation === direction.forward.notation ||
            notation === direction.roundhouse.notation) {
            return true;
        }

        return false;
    }

    public kickStrength(notation: number): string {
        switch (notation) {
            case direction.short.notation:
                return direction.short.name;
            case direction.forward.notation:
                return direction.forward.name;
            case direction.roundhouse.notation:
                return direction.roundhouse.name;
            default:
                return '';
        }
    }
}