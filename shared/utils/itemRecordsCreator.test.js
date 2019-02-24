const createItemRecords = require('./itemRecordsCreator');

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
        value: shortArticle.content.value + '<h2>More options</h2> <p>To make further app development easier, we recommend using the Kentico Cloud model generator for .NET to create strongly-typed models representing your content types. To learn more about this approach generally, see <a href="https://developer.kenticocloud.com/docs/strongly-typed-models">Using strongly typed models</a>.</p>'
    }
};

const longArticleWithCallout = {
    ...longArticle,
    content: {
        name: 'Content',
        value: longArticle.content.value
        + '<callout>New to headless CMS?\nIf you are new to the world of headless CMSs, you might want to start by building a Hello world application. It will only take you about 5 minutes!\nAfter you grasp the core idea behind a headless CMS, everything in the sample application will make a lot more sense much faster.</callout>'
        + '<h2>Making changes to your project</h2>\n<p>After signing in to your <a href="http://some.website.com">Kentico Cloud</a> account you will see your sample project to play around with.</p>\n'
    }
};

const articleWithMultipleCallouts = {
    ...shortArticle,
    content: {
        name: 'Content',
        value: '<callout>Callout number 1</callout>'
        + '<p>Some paragraph between two callouts</p>'
        + '<h2>Heading</h2>\n<p><strong>Text about Kentico Cloud</strong></p>'
        + '<callout>Callout number 2 Very useful advice about KC</callout>'
        + '<callout>Callout number 3</callout>'
        + '<p>Some paragraph between a callout and a heading</p>'
        + '<h2>Running the .NET MVC sample application</h2>\n<p>Before going any further, make sure you have the following.</p>'
        + '<h2>First run of the sample app</h2>\n<p>When you run the application for the first time, you will see a Configuration page. Use it to connect the app to your sample project in Kentico Cloud.</p>'
        + '<callout>Callout number 4</callout>'
    }
};

describe('searchableArticleCreator', () => {
    const firstParagraph = {
        content: 'We will start by running a React sample application on your machine and updating an article in the sample project.\n ...',
        title: 'Tutorial',
        heading: '',
        codename: 'first_tutorial',
        order: 1,
        objectID: 'first_tutorial_1',
        id: '59c40872-521f-4883-ae6e-4d11b77797e4',
    };

    const secondParagraph = {
        content: 'More options To make further app development easier, we recommend using the Kentico Cloud model generator for .NET to create strongly-typed models representing your content types. To learn more about this approach generally, see Using strongly typed models.',
        title: 'Tutorial',
        heading: 'More options',
        codename: 'first_tutorial',
        order: 2,
        objectID: 'first_tutorial_2',
        id: '59c40872-521f-4883-ae6e-4d11b77797e4',
    };

    test('creates a correct single article chunk and sanitizes its content', () => {
        const expectedResult = [firstParagraph];

        const actualResult = createItemRecords(
            shortArticle,
            shortArticle.content.value);

        expect(actualResult).toEqual(expectedResult);
    });

    test('splits a longer article into 2 chunks and sanitizes their content', () => {
        const expectedResult = [firstParagraph, secondParagraph];

        const actualResult = createItemRecords(
            longArticle,
            longArticle.content.value);

        expect(actualResult).toEqual(expectedResult);
    });

    test('splits article with a callout component correctly', () => {
        const expectedResult = [
            firstParagraph,
            secondParagraph, {
            content: 'New to headless CMS?\nIf you are new to the world of headless CMSs, you might want to start by building a Hello world application. It will only take you about 5 minutes!\nAfter you grasp the core idea behind a headless CMS, everything in the sample application will make a lot more sense much faster.',
            title: 'Tutorial',
            heading: 'More options',
            codename: 'first_tutorial',
            order: 3,
            objectID: 'first_tutorial_3',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        }, {
            content: 'Making changes to your project\nAfter signing in to your Kentico Cloud account you will see your sample project to play around with.',
            title: 'Tutorial',
            heading: 'Making changes to your project',
            codename: 'first_tutorial',
            order: 4,
            objectID: 'first_tutorial_4',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        }];

        const actualResult = createItemRecords(
            longArticleWithCallout,
            longArticleWithCallout.content.value);

        expect(actualResult).toEqual(expectedResult);
    });

    test('handles indexing of multiple callouts in an article', () => {
        const expectedResult = [{
            content: 'Callout number 1',
            title: 'Tutorial',
            heading: '',
            codename: 'first_tutorial',
            order: 1,
            objectID: 'first_tutorial_1',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        }, {
            content: 'Some paragraph between two callouts',
            title: 'Tutorial',
            heading: '',
            codename: 'first_tutorial',
            order: 2,
            objectID: 'first_tutorial_2',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        }, {
            content: 'Heading\nText about Kentico Cloud',
            title: 'Tutorial',
            heading: 'Heading',
            codename: 'first_tutorial',
            order: 3,
            objectID: 'first_tutorial_3',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        }, {
            content: 'Callout number 2 Very useful advice about KC',
            title: 'Tutorial',
            heading: 'Heading',
            codename: 'first_tutorial',
            order: 4,
            objectID: 'first_tutorial_4',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        }, {
            content: 'Callout number 3',
            title: 'Tutorial',
            heading: 'Heading',
            codename: 'first_tutorial',
            order: 5,
            objectID: 'first_tutorial_5',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        }, {
            content: 'Some paragraph between a callout and a heading',
            title: 'Tutorial',
            heading: 'Heading',
            codename: 'first_tutorial',
            order: 6,
            objectID: 'first_tutorial_6',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        }, {
            content: 'Running the .NET MVC sample application\nBefore going any further, make sure you have the following.',
            title: 'Tutorial',
            heading: 'Running the .NET MVC sample application',
            codename: 'first_tutorial',
            order: 7,
            objectID: 'first_tutorial_7',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        }, {
            content: 'First run of the sample app\nWhen you run the application for the first time, you will see a Configuration page. Use it to connect the app to your sample project in Kentico Cloud.',
            title: 'Tutorial',
            heading: 'First run of the sample app',
            codename: 'first_tutorial',
            order: 8,
            objectID: 'first_tutorial_8',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        }, {
            content: 'Callout number 4',
            title: 'Tutorial',
            heading: 'First run of the sample app',
            codename: 'first_tutorial',
            order: 9,
            objectID: 'first_tutorial_9',
            id: '59c40872-521f-4883-ae6e-4d11b77797e4',
        }];

        const actualResult = createItemRecords(
            articleWithMultipleCallouts,
            articleWithMultipleCallouts.content.value);

        expect(actualResult).toEqual(expectedResult);
    });
});
