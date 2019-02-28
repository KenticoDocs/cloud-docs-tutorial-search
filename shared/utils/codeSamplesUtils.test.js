const processLinkedCodeSamples = require('./codeSamplesUtils');

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

const text = 'Hello world: |~code_sample|hello_world|code_sample~|. Start by |~code_sample|first_import|code_sample~| and authetication |~code_sample|authentication|code_sample~|';
const incorrectText = 'Hello! |~code_sample|hello|code_sample~|. Start by |~code_sample|import|code_sample~|';

describe('processLinkedCodeSamples', () => {
    it('adds code sample content with languages to content', () => {
        const dotNetLanguageLabel = '|~language|_net|language~|';
        const jsLanguageLabel = '|~language|js|language~|';
        const expectedResult = `Hello world: |~innerItem|${dotNetLanguageLabel}${linkedItems[1].code.value}|innerItem~|. Start by |~innerItem|${jsLanguageLabel}${linkedItems[2].code.value}|innerItem~| and authetication |~innerItem|Authorization: Bearer <YOUR_API_KEY>|innerItem~|`;

        const actualResult = processLinkedCodeSamples(text, linkedItems);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns unchanged text on no code sample match', () => {
        const expectedResult = incorrectText;

        const actualResult = processLinkedCodeSamples(incorrectText, linkedItems);

        expect(actualResult).toEqual(expectedResult);
    });
});
