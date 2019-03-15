const resolveItemInRichText = require('./richTextResolver');
const {
    InnerItemMarkStart,
    InnerItemMarkEnd,
    CodeSampleMarkStart,
    CodeSampleMarkEnd,
    InstructionsMarkStart,
    InstructionsMarkEnd,
} = require('./richTextLabels');

const calloutItem = {
    system: {
        id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        language: 'en-US',
        codename: 'premium_feature',
        type: 'callout'
    },
    content: {
        name: 'Content',
        value: '<p><strong>Premium feature</strong></p>\n<p>Features described on this page require the Professional plan or higher.</p>',
    },
    title: {
        name: 'Title',
        value: 'Premium feature'
    }
};

const contentChunkItem = {
    system: {
        id: '43e9af9c-569e-4c55-9025-a468bff5018b',
        language: 'en-US',
        codename: 'repeated_content',
        type: 'content_chunk',
    },
    content: {
        name: 'Content',
        value: '<h2>Repeated content</h2><p>This content is repeated in several Articles</p>',
    }
};

const codeSampleItem = {
    system: {
        id: '0673f30a-cfe3-4bcf-85c4-dbb9c96288e8',
        language: 'en-US',
        codename: 'hello_world',
        type: 'code_sample',
    },
    code: {
        name: 'Code',
        value: 'alert( \'Hello, World!\' );',
    }
};

const codeSamplesItem = {
    system: {
        id: 'be3bda65-9857-4cfe-b01d-05eb8bc739be',
        language: 'en-US',
        codename: 'hello_world',
        type: 'code_samples',
    },
    elements: {
        code_samples: {
            value: [
                'first_sample',
                'second_sample',
                'hello_world',
            ]
        }
    }
};

const contentSwitcherItem = {
    system: {
        id: '75b6d00f-95e3-4311-9d7a-e33915e2b733',
        language: 'en-US',
        codename: 'some_content_switcher',
        type: 'content_switcher',
    },
    children: [{
        system: {
            id: '75b6d00f-95e3-4311-9d7a-e33915e2b733',
            language: 'en-US',
            codename: 'some_instruction',
            type: 'instructions',
        },
    }, {
        system: {
            id: '37f3ff4e-a326-4399-8bfd-af46c43f826a',
            language: 'en-US',
            codename: 'another_instruction',
            type: 'instructions',
        },
    }, {
        system: {
            id: 'eea049fb-9bbc-4b79-a388-12548ec14bb5',
            language: 'en-US',
            codename: 'something',
            type: 'incorrect',
        },
    }]
};

const differentItem = {
    ...calloutItem,
    system: {
        id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        language: 'en-US',
        codename: 'premium_feature',
        type: 'article'
    },
};

describe('resolveItemInRichText', () => {
    it('returns sanitized value of a callout content item', () => {
        const expectedResult = `${InnerItemMarkStart}Premium feature\nFeatures described on this page require the Professional plan or higher.${InnerItemMarkEnd}`;

        const actualResult = resolveItemInRichText(calloutItem);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns empty string of a non callout content item', () => {
        const expectedResult = '';

        const actualResult = resolveItemInRichText(differentItem);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns value of a content chunk content item', () => {
        const expectedResult = contentChunkItem.content.value;

        const actualResult = resolveItemInRichText(contentChunkItem);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns value of a code sample item', () => {
        const expectedResult = `${CodeSampleMarkStart}${codeSampleItem.system.codename}${CodeSampleMarkEnd}`;

        const actualResult = resolveItemInRichText(codeSampleItem);

        expect(actualResult).toEqual(expectedResult);
    });

    it('resolves code samples item', () => {
        const expectedResult =
            `${CodeSampleMarkStart}first_sample${CodeSampleMarkEnd}` +
            `${CodeSampleMarkStart}second_sample${CodeSampleMarkEnd}` +
            `${CodeSampleMarkStart}hello_world${CodeSampleMarkEnd}`;

        const actualResult = resolveItemInRichText(codeSamplesItem);

        expect(actualResult).toEqual(expectedResult);
    });

    it('resolves instructions items within content switcher item', () => {
        const expectedResult =
            `${InstructionsMarkStart}some_instruction${InstructionsMarkEnd}` +
            `${InstructionsMarkStart}another_instruction${InstructionsMarkEnd}`;

        const actualResult = resolveItemInRichText(contentSwitcherItem);

        expect(actualResult).toEqual(expectedResult);
    })
});
