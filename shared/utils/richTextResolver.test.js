const resolveItemInRichText = require('./richTextResolver');

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
        const expectedResult = '<callout>Premium feature\nFeatures described on this page require the Professional plan or higher.</callout>';

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
});
