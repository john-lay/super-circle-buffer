export interface IDirection {
    alias: string;
    notation: number;
}

export interface IDirections {
    down: IDirection,
    downForward: IDirection,
    forward: IDirection,

    jab: IDirection
}