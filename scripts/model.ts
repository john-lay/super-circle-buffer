export interface IDirection {
    alias: string;
    notation: number;
    name: string;
}

export interface IDirections {
    downBack: IDirection,
    down: IDirection,
    downToward: IDirection,
    back: IDirection,
    toward: IDirection,
    upBack: IDirection,
    up: IDirection,
    upToward: IDirection,

    jab: IDirection,
    strong: IDirection,
    fierce: IDirection
}

export interface IInput {
    notation: number;
    frame: number;
}