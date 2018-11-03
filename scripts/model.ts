export interface IDirection {
    alias: string;
    notation: number;
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

    jab: IDirection
}

export interface IInput {
    notation: number;
    frame: number;
}