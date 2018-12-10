const getCodenamesOfItems = require('./codenamesExtractor');

const items = [
    {
        language: 'default',
        codename: 'article_i',
        type: 'article'
    },
    {
        language: 'default',
        codename: 'article_ii',
        type: 'article'
    },
    {
        language: 'default',
        codename: 'article_iii',
        type: 'article'
    },
    {
        language: 'default',
        codename: 'used_in_article',
        type: 'callout'
    }
];

describe('getCodenamesOfItems', () => {
    it('extracts codenames of articles correctly', () => {
        const contentType = 'article';
        const expectedResult = [
            'article_i',
            'article_ii',
            'article_iii'
        ];

        const actualResult = getCodenamesOfItems(items, contentType);

        expect(actualResult).toEqual(expectedResult);
    });

    it('handles faulty content type and returns an empty array', () => {
        const contentType = 'document';
        const expectedResult = [];

        const actualResult = getCodenamesOfItems(items, contentType);

        expect(actualResult).toEqual(expectedResult);
    });
});
