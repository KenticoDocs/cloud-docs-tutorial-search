const {
    getLanguageLabel,
    getInnerItemLabel,
    getCodeSampleLabel,
    getInstructionsLabel
} = require('./richTextLabels');

describe('getLanguageLabel', () => {
    it('labels the language correctly', () => {
        const language = '_net';
        const expectedResult = '|~language|_net|language~|';

        const actualResult = getLanguageLabel(language);

        expect(actualResult).toEqual(expectedResult);
    })
});

describe('getInnerItemLabel', () => {
    it('labels the content correctly', () => {
        const innerItemContent = 'some important content';
        const expectedResult = '|~innerItem|some important content|innerItem~|';

        const actualResult = getInnerItemLabel(innerItemContent);

        expect(actualResult).toEqual(expectedResult);
    })
});

describe('getCodeSampleLabel', () => {
    it('labels the codename correctly', () => {
        const codeSampleCodename = 'hello_world';
        const expectedResult = '|~code_sample|hello_world|code_sample~|';

        const actualResult = getCodeSampleLabel(codeSampleCodename);

        expect(actualResult).toEqual(expectedResult);
    })
});

describe('getInstructionsLabel', () => {
    it('labels the codename correctly', () => {
        const instructionsCodename = 'tutorial_in_react';
        const expectedResult = '|~instructions|tutorial_in_react|instructions~|';

        const actualResult = getInstructionsLabel(instructionsCodename);

        expect(actualResult).toEqual(expectedResult);
    })
});
