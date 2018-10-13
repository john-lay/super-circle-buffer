export interface IDirection {
    name: string;
    notation: number;
}

export interface IDirections {
    down: IDirection,
    downForward: IDirection,
    forward: IDirection
}