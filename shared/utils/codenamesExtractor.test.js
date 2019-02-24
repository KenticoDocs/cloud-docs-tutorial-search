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
        codename: 'scenario_i',
        type: 'scenario'
    },
    {
        language: 'default',
        codename: 'used_in_article',
        type: 'callout'
    }
];

describe('getCodenamesOfItems', () => {
    it('extracts codenames of items correctly', () => {
        const contentTypes = ['article', 'scenario'];
        const expectedResult = [
            'article_i',
            'article_ii',
            'article_iii',
            'scenario_i'
        ];

        const actualResult = getCodenamesOfItems(items, contentTypes);

        expect(actualResult).toEqual(expectedResult);
    });

    it('handles faulty content type and returns an empty array', () => {
        const contentTypes = ['document'];
        const expectedResult = [];

        const actualResult = getCodenamesOfItems(items, contentTypes);

        expect(actualResult).toEqual(expectedResult);
    });
});
