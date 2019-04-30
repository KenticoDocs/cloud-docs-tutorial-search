const getRootCodenamesOfSingleItem = require('./rootItemsGetter');

const allItems = [{
    system: {
        codename: 'hello_world',
        type: 'callout',
    },
    elements: {
        content: {
            value: 'callout content',
            modular_content: [],
        },
    },
}, {
    system: {
        codename: 'some_chunk',
        type: 'content_chunk',
    },
    elements: {
        content: {
            modular_content: ['hello_world'],
        },
    },
}, {
    system: {
        codename: 'root_article',
        type: 'article',
    },
    elements: {
        content: {
            modular_content: [],
        },
        introduction: {
            modular_content: ['some_chunk'],
        },
    },
}, {
    system: {
        codename: 'root_scenario',
        type: 'scenario',
    },
    elements: {
        content: {
            modular_content: ['hello_world'],
        },
        introduction: {
            modular_content: [],
        },
    },
}];

const allItemsWithCodeSamples = [{
    system: {
        codename: 'hello_world_samples',
        type: 'code_samples',
    },
    elements: {
        code_samples: {
            value: ['hello_world'],
        },
    },
}, {
    system: {
        codename: 'code_sample_chunk',
        type: 'content_chunk',
    },
    elements: {
        content: {
            modular_content: ['hello_world_samples'],
        },
        introduction: {
            modular_content: [],
        },
    },
}, {
    system: {
        codename: 'main_article',
        type: 'article',
    },
    elements: {
        content: {
            modular_content: [],
        },
        introduction: {
            modular_content: ['code_sample_chunk'],
        },
    },
}];

describe('getRootCodenamesOfSingleItem', () => {
    it('returns both root items - article and scenario', () => {
        const item = {
            codename: 'hello_world',
            type: 'callout',
        };
        const expectedResult = ['root_scenario', 'root_article'];

        const actualResult = getRootCodenamesOfSingleItem(item, allItems);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns root of a nested code_sample item', () => {
        const item = {
            codename: 'hello_world',
            type: 'code_sample',
        };
        const expectedResult = ['main_article'];

        const actualResult = getRootCodenamesOfSingleItem(item, allItemsWithCodeSamples);

        expect(actualResult).toEqual(expectedResult);
    });

    it('returns an empty array when it finds no root items', () => {
        const item = {
            codename: 'some_codename',
            type: 'some_type',
        };
        const expectedResult = [];

        const actualResult = getRootCodenamesOfSingleItem(item, allItemsWithCodeSamples);

        expect(actualResult).toEqual(expectedResult);
    })
});
