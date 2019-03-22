const processLinkedCodeSamples = require('./codeSamplesUtils');
const {
    PlatformMarkStart,
    PlatformMarkEnd,
    InnerItemMarkStart,
    InnerItemMarkEnd,
    CodeSampleMarkStart,
    CodeSampleMarkEnd,
} = require('./richTextLabels');

const linkedItems = {
    1: {
        system: {
            type: 'code_sample',
            codename: 'hello_world'
        },
        code: {
            value: 'Console.WriteLine("Hello World!");'
        },
        platform: {
            value: [{
                codename: '_net'
            }]
        }
    },
    2: {
        system: {
            type: 'code_sample',
            codename: 'first_import'
        },
        code: {
            value: 'import { DeliveryClient } from \'kentico-cloud-delivery\';'
        },
        platform: {
            value: [{
                codename: 'js'
            }]
        }
    },
    3: {
        system: {
            type: 'invalid',
            codename: 'great_sample'
        },
        code: {
            value: 'this is definitely not code sample'
        },
        platform: {
            value: []
        }
    },
    4: {
        system: {
            type: 'code_sample',
            codename: 'authentication'
        },
        code: {
            value: 'Authorization: Bearer <YOUR_API_KEY>'
        },
        platform: {
            value: []
        }
    }
};

const text = `Hello world: ${CodeSampleMarkStart}hello_world${CodeSampleMarkEnd}. Start by ${CodeSampleMarkStart}first_import${CodeSampleMarkEnd} and authetication ${CodeSampleMarkStart}authentication${CodeSampleMarkEnd}`;
const incorrectText = `Hello! ${CodeSampleMarkStart}hello${CodeSampleMarkEnd}. Start by ${CodeSampleMarkStart}import${CodeSampleMarkEnd}`;

describe('processLinkedCodeSamples', () => {
    it('adds code sample content with platforms to content', () => {
        const dotNetPlatformLabel = `${PlatformMarkStart}_net${PlatformMarkEnd}`;
        const jsPlatformLabel = `${PlatformMarkStart}js${PlatformMarkEnd}`;
        const expectedResult = `Hello world: ${InnerItemMarkStart}${dotNetPlatformLabel}${linkedItems[1].code.value}${InnerItemMarkEnd}. Start by ${InnerItemMarkStart}${jsPlatformLabel}${linkedItems[2].code.value}${InnerItemMarkEnd} and authetication ${InnerItemMarkStart}Authorization: Bearer <YOUR_API_KEY>${InnerItemMarkEnd}`;

        const actualResult = processLinkedCodeSamples(text, linkedItems);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns unchanged text on no code sample match', () => {
        const expectedResult = incorrectText;

        const actualResult = processLinkedCodeSamples(incorrectText, linkedItems);

        expect(actualResult).toEqual(expectedResult);
    });
});
