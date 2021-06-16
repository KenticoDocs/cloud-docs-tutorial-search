import { getRelevantItems } from './itemFilter';

const items: any = [
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

describe('getRelevantItems', () => {
    it('extracts codenames and types of items correctly', () => {
        const contentTypes = ['article', 'scenario'];
        const expectedResult = [
            {
                type: 'article',
                codename: 'article_i'
            },
            {
                type: 'article',
                codename: 'article_ii'
            },
            {
                type: 'article',
                codename: 'article_iii'
            },
            {
                type: 'scenario',
                codename: 'scenario_i'
            }
        ];

        const actualResult = getRelevantItems(items, contentTypes);

        expect(actualResult).toEqual(expectedResult);
    });

    it('handles faulty content type and returns an empty array', () => {
        const contentTypes: any[] = ['document'];
        const expectedResult: any[] = [];

        const actualResult = getRelevantItems(items, contentTypes);

        expect(actualResult).toEqual(expectedResult);
    });
});
