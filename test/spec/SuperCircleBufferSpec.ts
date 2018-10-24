import { } from 'jasmine';
import { SuperCircleBuffer } from "../../scripts/main";

declare var superCircleBuffer: SuperCircleBuffer;

describe("SuperCircleBuffer", () => {
    beforeEach(() => {
        superCircleBuffer.specialMoves = [];
    });
    describe("when no keys are input, checkForFireball", () => {
        it("should register no special moves", () => {
            // Arrange

            // Act
            superCircleBuffer.checkForFireball(0);

            // Assert
            expect(superCircleBuffer.specialMoves.length).toEqual(0);
        });

    });
    describe("when correct keys are input", () => {
        it("should register a jab hadoken", () => {
            // Arrange

            // Act
            superCircleBuffer.addInput(superCircleBuffer.direction.down);
            superCircleBuffer.addInput(superCircleBuffer.direction.downForward);
            superCircleBuffer.addInput(superCircleBuffer.direction.forward);
            superCircleBuffer.addInput(superCircleBuffer.direction.jab);

            // Assert
            expect(superCircleBuffer.specialMoves.length).toEqual(1);
            expect(superCircleBuffer.specialMoves[0]).toEqual('(Jab) Hadoken!');
        });
    });
});