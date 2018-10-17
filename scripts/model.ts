export interface IDirection {
    alias: string;
    notation: number;
}

export interface IDirections {
    down: IDirection,
    downForward: IDirection,
    back: IDirection,
    forward: IDirection,

    jab: IDirection
}

export interface IInput {
    notation: number;
    frame: number;
}