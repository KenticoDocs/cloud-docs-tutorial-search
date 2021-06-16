import { getRootCodenamesOfSingleItem } from './rootItemsGetter';

const allItems: any = [{
    system: {
        codename: 'hello_world',
        type: 'callout',
    },
        content: {
            value: 'callout content',
            linkedItemCodenames: [],
        },
}, {
    system: {
        codename: 'some_chunk',
        type: 'content_chunk',
    },
        content: {
            linkedItemCodenames: ['hello_world'],
        },
}, {
    system: {
        codename: 'root_article',
        type: 'article',
    },
        content: {
            linkedItemCodenames: [],
        },
        introduction: {
            linkedItemCodenames: ['some_chunk'],
        },
}, {
    system: {
        codename: 'root_scenario',
        type: 'scenario',
    },
        content: {
            linkedItemCodenames: ['hello_world'],
        },
        introduction: {
            linkedItemCodenames: [],
        },
}];

const allItemsWithCodeSamples: any = [{
    system: {
        codename: 'hello_world_samples',
        type: 'code_samples',
    },
        codeSamples: {
            value: [
                {
                    system: {
                        codename: 'hello_world'
                    }
                }
            ]
        },
}, {
    system: {
        codename: 'code_sample_chunk',
        type: 'content_chunk',
    },
        content: {
            linkedItemCodenames: ['hello_world_samples'],
        },
        introduction: {
            linkedItemCodenames: [],
        },
}, {
    system: {
        codename: 'main_article',
        type: 'article',
    },
        content: {
            linkedItemCodenames: [],
        },
        introduction: {
            linkedItemCodenames: ['code_sample_chunk'],
        },
}];

describe('getRootCodenamesOfSingleItem', () => {
    it('returns both root items - article and scenario', () => {
        const item: any = {
                codename: 'hello_world',
                type: 'callout',
        };
        const expectedResult = ['root_scenario', 'root_article'];

        const actualResult = getRootCodenamesOfSingleItem(item, allItems);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns root of a nested code_sample item', () => {
        const item: any = {
                codename: 'hello_world',
                type: 'code_sample',
        };
        const expectedResult = ['main_article'];

        const actualResult = getRootCodenamesOfSingleItem(item, allItemsWithCodeSamples);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns an empty array when it finds no root items', () => {
        const item: any = {
                codename: 'some_codename',
                type: 'some_type',
        };
        const expectedResult: any[] = [];

        const actualResult = getRootCodenamesOfSingleItem(item, allItemsWithCodeSamples);

        expect(actualResult).toEqual(expectedResult);
    })
});
