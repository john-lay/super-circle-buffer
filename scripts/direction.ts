/// <reference path="model.ts" />

// using japanese street fighter notation for direction
// https://sonichurricane.com/articles/sfnotation.html
 const direction: IDirections = {
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
    fierce: { alias: 'hp', notation: 0xC, name: 'fierce' },
    short: { alias: 'lk', notation: 0xD, name: 'short' },
    forward: { alias: 'mk', notation: 0xE, name: 'forward' },
    roundhouse: { alias: 'hk', notation: 0xF, name: 'roundhouse' }
}