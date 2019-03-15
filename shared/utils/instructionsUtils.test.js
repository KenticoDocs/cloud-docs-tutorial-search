const {
    parseCodenamesOfInstructionsFromText,
    insertInstructionsContentIntoText,
} = require('./instructionsUtils');
const {
    InnerItemMarkStart,
    InnerItemMarkEnd,
    InstructionsMarkStart,
    InstructionsMarkEnd,
} = require('./richTextLabels');

const textWithInstructions =
    `Let's see what we have here:${InstructionsMarkStart}instruction_codename_1${InstructionsMarkEnd}${InstructionsMarkStart}instruction_codename_2${InstructionsMarkEnd}.`;

const textWithoutInstructions =
    `Let's see what we have here:${InnerItemMarkStart}some_codename${InnerItemMarkEnd}${InnerItemMarkStart}callout_codename${InnerItemMarkEnd}`;

const instructionText = 'You are supposed to do this...';

describe('parseCodenamesOfInstructionsFromText', () => {
    it('returns codenames of instructions', () => {
        const expectedResult = [
            'instruction_codename_1',
            'instruction_codename_2',
        ];

        const actualResult = parseCodenamesOfInstructionsFromText(textWithInstructions);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns an empty array on no instructions found', () => {
        const expectedResult = [];

        const actualResult = parseCodenamesOfInstructionsFromText(textWithoutInstructions);

        expect(actualResult).toEqual(expectedResult);
    });
});

describe('insertInstructionsContentIntoText', () => {
    it('returns text with correctly inserted instruction', () => {
        const expectedResult = `Let's see what we have here: ${instructionText} .`;

        const actualResult = insertInstructionsContentIntoText(textWithInstructions, instructionText);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns unchanged text on no instructions found', () => {
        const expectedResult = textWithoutInstructions;

        const actualResult = insertInstructionsContentIntoText(textWithoutInstructions, instructionText);

        expect(actualResult).toEqual(expectedResult);
    });
});
