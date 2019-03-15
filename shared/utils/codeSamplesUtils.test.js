const processLinkedCodeSamples = require('./codeSamplesUtils');
const {
    LanguageMarkStart,
    LanguageMarkEnd,
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
        programmingLanguage: {
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
        programmingLanguage: {
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
        programmingLanguage: {
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
        programmingLanguage: {
            value: []
        }
    }
};

const text = `Hello world: ${CodeSampleMarkStart}hello_world${CodeSampleMarkEnd}. Start by ${CodeSampleMarkStart}first_import${CodeSampleMarkEnd} and authetication ${CodeSampleMarkStart}authentication${CodeSampleMarkEnd}`;
const incorrectText = `Hello! ${CodeSampleMarkStart}hello${CodeSampleMarkEnd}. Start by ${CodeSampleMarkStart}import${CodeSampleMarkEnd}`;

describe('processLinkedCodeSamples', () => {
    it('adds code sample content with languages to content', () => {
        const dotNetLanguageLabel = `${LanguageMarkStart}_net${LanguageMarkEnd}`;
        const jsLanguageLabel = `${LanguageMarkStart}js${LanguageMarkEnd}`;
        const expectedResult = `Hello world: ${InnerItemMarkStart}${dotNetLanguageLabel}${linkedItems[1].code.value}${InnerItemMarkEnd}. Start by ${InnerItemMarkStart}${jsLanguageLabel}${linkedItems[2].code.value}${InnerItemMarkEnd} and authetication ${InnerItemMarkStart}Authorization: Bearer <YOUR_API_KEY>${InnerItemMarkEnd}`;

        const actualResult = processLinkedCodeSamples(text, linkedItems);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns unchanged text on no code sample match', () => {
        const expectedResult = incorrectText;

        const actualResult = processLinkedCodeSamples(incorrectText, linkedItems);

        expect(actualResult).toEqual(expectedResult);
    });
});
