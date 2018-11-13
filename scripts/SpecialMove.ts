/// <reference path="model.ts" />

abstract class SpecialMove {    
    abstract inputLeniency: number;
    abstract lightAttackLeniency: number;
    abstract mediumAttackLeniency: number;
    abstract highAttackLeniency: number;

    abstract check(inputBuffer: IInput[]): boolean;
}