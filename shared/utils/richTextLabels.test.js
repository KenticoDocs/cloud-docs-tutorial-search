const {
    getLanguageLabel,
    getInnerItemLabel,
    getCodeSampleLabel,
    getInstructionsLabel,
    LanguageMarkStart,
    LanguageMarkEnd,
    InnerItemMarkStart,
    InnerItemMarkEnd,
    CodeSampleMarkStart,
    CodeSampleMarkEnd,
    InstructionsMarkStart,
    InstructionsMarkEnd,
} = require('./richTextLabels');

describe('getLanguageLabel', () => {
    it('labels the language correctly', () => {
        const language = '_net';
        const expectedResult = `${LanguageMarkStart}_net${LanguageMarkEnd}`;

        const actualResult = getLanguageLabel(language);

        expect(actualResult).toEqual(expectedResult);
    })
});

describe('getInnerItemLabel', () => {
    it('labels the content correctly', () => {
        const innerItemContent = 'some important content';
        const expectedResult = `${InnerItemMarkStart}some important content${InnerItemMarkEnd}`;

        const actualResult = getInnerItemLabel(innerItemContent);

        expect(actualResult).toEqual(expectedResult);
    })
});

describe('getCodeSampleLabel', () => {
    it('labels the codename correctly', () => {
        const codeSampleCodename = 'hello_world';
        const expectedResult = `${CodeSampleMarkStart}hello_world${CodeSampleMarkEnd}`;

        const actualResult = getCodeSampleLabel(codeSampleCodename);

        expect(actualResult).toEqual(expectedResult);
    })
});

describe('getInstructionsLabel', () => {
    it('labels the codename correctly', () => {
        const instructionsCodename = 'tutorial_in_react';
        const expectedResult = `${InstructionsMarkStart}tutorial_in_react${InstructionsMarkEnd}`;

        const actualResult = getInstructionsLabel(instructionsCodename);

        expect(actualResult).toEqual(expectedResult);
    })
});
