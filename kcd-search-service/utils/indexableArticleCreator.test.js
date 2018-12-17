const createIndexableArticle = require('./indexableArticleCreator');

const shortArticle = {
    system: {
        id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        language: 'en-US',
        codename: 'first_tutorial',
    },
    title: {
        name: 'Title',
        value: 'Tutorial'
    },
    shortTitle: {
        name: 'Short title',
        value: 'We will show you the basics'
    },
    author: {
        name: 'Author',
        value: 'smart guy'
    },
    description: {
        name: 'Description',
        value: 'This article explains how to do stuff'
    },
    contentType: {
        name: 'Content type',
        value: 'article'
    },
    content: {
        name: 'Content',
        value: '<p>We will start by running a React sample application on your machine and updating an article in the sample project.</p> \n ... '
    }
};

const longArticle = {
    ...shortArticle,
    content: {
        name: 'Content',
        value: shortArticle.content.value +  '<h2> More options </h2> <p>To make further app development easier, we recommend using the Kentico Cloud model generator for .NET to create strongly-typed models representing your content types. To learn more about this approach generally, see <a href=\"https://developer.kenticocloud.com/docs/strongly-typed-models\">Using strongly typed models</a>.</p>'
    }
};

describe('searchableArticleCreator', () => {
    const firstParagraph = {
        content: 'We will start by running a React sample application on your machine and updating an article in the sample project.\n ...',
        description: 'This article explains how to do stuff',
        contentType: 'article',
        shortTitle: 'We will show you the basics',
        title: 'Tutorial',
        codename: 'first_tutorial',
        order: 1,
        objectID: 'first_tutorial_1',
    };

    const secondParagraph = {
        ...firstParagraph,
        content: ' More options  To make further app development easier, we recommend using the Kentico Cloud model generator for .NET to create strongly-typed models representing your content types. To learn more about this approach generally, see Using strongly typed models.',
        order: 2,
        objectID: 'first_tutorial_2',
    };

    test('creates a correct searchable single article object and sanitizes its content', () => {
        const expectedResult = firstParagraph;

        const actualResult = createIndexableArticle(shortArticle)[0];

        expect(actualResult).toEqual(expectedResult);
        expect(actualResult.author).toBeNull;
        expect(actualResult.system).toBeNull;
    });

    test('splits a longer article into 2 objects and sanitizes their content', () => {
        const expectedResult = [firstParagraph, secondParagraph];

        const actualResult = createIndexableArticle(longArticle);

        expect(actualResult).toEqual(expectedResult);
        expect(actualResult.author).toBeNull;
        expect(actualResult.system).toBeNull;
    });
});
