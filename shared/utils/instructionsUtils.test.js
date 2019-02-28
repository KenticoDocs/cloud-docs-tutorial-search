const { parseCodenamesOfInstructionsFromText, insertInstructionsContentIntoText } = require('./instructionsUtils');

const textWithInstructions =
    'Let\'s see what we have here:|~instructions|instruction_codename_1|instructions~||~instructions|instruction_codename_2|instructions~|.';

const textWithoutInstructions =
    'Let\'s see what we have here:|~innerItem|some_codename|~innerItem||~innerItem|callout_codename|~innerItem|';

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
