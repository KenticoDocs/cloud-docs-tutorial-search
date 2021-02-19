const codeSamplesUtils = require('./codeSamplesUtils');
const {
    PlatformMarkStart,
    PlatformMarkEnd,
    InnerItemMarkStart,
    InnerItemMarkEnd,
    CodeSampleMarkStart,
    CodeSampleMarkEnd,
    CodeSampleHeadingMarkStart,
    CodeSampleHeadingMarkEnd,
    IsCodeSampleIdentifierMarkup
} = require('./richTextLabels');

const linkedItems = {
    1: {
        system: {
            type: 'code_sample',
            codename: 'hello_world',
        },
        code: {
            value: 'Console.WriteLine("Hello World!");',
        },
        platform: {
            value: [{
                codename: '_net',
            }],
        },
    },
    2: {
        system: {
            type: 'code_sample',
            codename: 'first_import',
        },
        code: {
            value: 'import { DeliveryClient } from \'kentico-kontent-delivery\';',
        },
        platform: {
            value: [{
                codename: 'js',
            }],
        },
    },
    3: {
        system: {
            type: 'code_sample',
            codename: 'authentication',
        },
        code: {
            value: 'Authorization: Bearer <YOUR_API_KEY>',
        },
        platform: {
            value: [],
        },
    },
    4: {
        system: {
            type: 'invalid',
            codename: 'great_sample',
        },
        code: {
            value: 'this is definitely not code sample',
        },
        platform: {
            value: [],
        },
    },
    5: {
        system: {
            type: 'code_sample',
            codename: 'model_net',
        },
        code: {
            value: '<h2>@Model.Title</h2>',
        },
        platform: {
            value: [{
                codename: '_net',
            }],
        },
    },
};

const dotNetPlatformLabel = `${PlatformMarkStart}_net${PlatformMarkEnd}`;
const jsPlatformLabel = `${PlatformMarkStart}js${PlatformMarkEnd}`;

describe('insertLinkedCodeSamples', () => {
    const codeSample = `Hello world: ${CodeSampleMarkStart}hello_world${CodeSampleMarkEnd}. Start by ${CodeSampleMarkStart}first_import${CodeSampleMarkEnd} and authetication ${CodeSampleMarkStart}authentication${CodeSampleMarkEnd}`;
    const codeSampleWithHeading = `Hello world: ${CodeSampleMarkStart}model_net${CodeSampleMarkEnd}.`;
    const incorrectCodeSample = `Hello! ${CodeSampleMarkStart}hello${CodeSampleMarkEnd}. Start by ${CodeSampleMarkStart}import${CodeSampleMarkEnd}`;

    it('adds code sample content with platforms to content', () => {
        const expectedResult = `Hello world: ${InnerItemMarkStart}${IsCodeSampleIdentifierMarkup}${dotNetPlatformLabel}${linkedItems[1].code.value}${InnerItemMarkEnd}. Start by ${InnerItemMarkStart}${IsCodeSampleIdentifierMarkup}${jsPlatformLabel}${linkedItems[2].code.value}${InnerItemMarkEnd} and authetication ${InnerItemMarkStart}${IsCodeSampleIdentifierMarkup}Authorization: Bearer <YOUR_API_KEY>${InnerItemMarkEnd}`;

        const actualResult = codeSamplesUtils.insertLinkedCodeSamples(codeSample, linkedItems);

        expect(actualResult).toEqual(expectedResult);
    });

    it('replaces a heading in code sample with markings', () => {
        const expectedResult = `Hello world: ${InnerItemMarkStart}${IsCodeSampleIdentifierMarkup}${dotNetPlatformLabel}${CodeSampleHeadingMarkStart}@Model.Title${CodeSampleHeadingMarkEnd}${InnerItemMarkEnd}.`;

        const actualResult = codeSamplesUtils.insertLinkedCodeSamples(codeSampleWithHeading, linkedItems);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns unchanged text on no code sample match', () => {
        const expectedResult = incorrectCodeSample;

        const actualResult = codeSamplesUtils.insertLinkedCodeSamples(incorrectCodeSample, linkedItems);

        expect(actualResult).toEqual(expectedResult);
    });
});

describe('replaceHeadingMarksWithTags', () => {
    it('replaces marks with actual headings', () => {
        const codeSampleWithMarkedHeading = `Hello world: ${InnerItemMarkStart}${dotNetPlatformLabel}${CodeSampleHeadingMarkStart}@Model.Title${CodeSampleHeadingMarkEnd}${InnerItemMarkEnd}.`;
        const expectedResult = `Hello world: ${InnerItemMarkStart}${dotNetPlatformLabel}<h2>@Model.Title</h2>${InnerItemMarkEnd}.`;

        const actualResult = codeSamplesUtils.replaceHeadingMarksWithTags(codeSampleWithMarkedHeading);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns unchanged text when it has no heading mark', () => {
        const codeSample = `Hello world: ${InnerItemMarkStart}${dotNetPlatformLabel}@Model.Title${InnerItemMarkEnd}.`;
        const expectedResult = codeSample;

        const actualResult = codeSamplesUtils.replaceHeadingMarksWithTags(codeSample);

        expect(actualResult).toEqual(expectedResult);
    });
});
