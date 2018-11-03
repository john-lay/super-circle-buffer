export interface IDirection {
    alias: string;
    notation: number;
    name: string;
}

export interface IDirections {
    downBack: IDirection,
    down: IDirection,
    downForward: IDirection,
    back: IDirection,
    forward: IDirection,
    upBack: IDirection,
    up: IDirection,
    upForward: IDirection,

    jab: IDirection,
    strong: IDirection,
    fierce: IDirection
}

export interface IInput {
    notation: number;
    frame: number;
}