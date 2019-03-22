const {
    getPlatformLabel,
    getInnerItemLabel,
    getCodeSampleLabel,
    PlatformMarkStart,
    PlatformMarkEnd,
    InnerItemMarkStart,
    InnerItemMarkEnd,
    CodeSampleMarkStart,
    CodeSampleMarkEnd,
} = require('./richTextLabels');

describe('getPlatformLabel', () => {
    it('labels the platform correctly', () => {
        const platform = '_net';
        const expectedResult = `${PlatformMarkStart}_net${PlatformMarkEnd}`;

        const actualResult = getPlatformLabel(platform);

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
