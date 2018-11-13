"use strict";
/// <reference path="../../scripts/main.ts" />
/// <reference path="../../scripts/direction.ts" />
/// <reference path="../lib/jasmine-3.2.1/jasmine.d.ts" />
describe("SuperCircleBuffer", function () {
    beforeEach(function () {
        superCircleBuffer.specialMoves = [];
    });
    describe("when no keys are input, checkForFireball", function () {
        it("should register no special moves", function () {
            // Arrange
            // Act
            superCircleBuffer.checkForFireball(0);
            // Assert
            expect(superCircleBuffer.specialMoves.length).toEqual(0);
        });
    });
    describe("when correct keys are input", function () {
        it("should register a jab hadoken", function () {
            // Arrange
            // Act
            superCircleBuffer.addInput(direction.down);
            superCircleBuffer.addInput(direction.downToward);
            superCircleBuffer.addInput(direction.forward);
            superCircleBuffer.addInput(direction.jab);
            // Assert
            expect(superCircleBuffer.specialMoves.length).toEqual(1);
            expect(superCircleBuffer.specialMoves[0]).toEqual('(Jab) Hadoken!');
        });
    });
});
