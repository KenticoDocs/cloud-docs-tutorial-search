const searchIndex = require('./external/searchIndex');
const kenticoClient = require('./external/kenticoClient');
const createIndexableArticle = require('./utils/indexableArticleCreator');
const resolveItemInRichText = require('./utils/richTextResolver');

async function reindexAllArticles() {
    await searchIndex.clearIndex();

    await kenticoClient
        .items()
        .type('article')
        .queryConfig({
            richTextResolver: resolveItemInRichText
        })
        .getPromise()
        .then(response =>
            response.items.forEach(article => resolveAndIndexArticle(article)));
}

async function reindexSpecificArticles(codenames) {
    await codenames.map(codename => searchIndex.deleteBy({
        filters: `codename:${codename}`
    }));

    await codenames.forEach(
         codename => kenticoClient
            .item(codename)
            .queryConfig({
                richTextResolver: resolveItemInRichText
            })
            .getPromise()
            .then(response => resolveAndIndexArticle(response.item)));
}

async function resolveAndIndexArticle(article) {
    if (article.content) {
        const articleWithResolvedRichTextComponents = {
            ...article,
            content: {
                value: article.content.getHtml()
            }
        };
        const articleChunks = createIndexableArticle(articleWithResolvedRichTextComponents);
        await searchIndex.saveObjects(articleChunks);
    }
}

module.exports = {
    reindexAllArticles,
    reindexSpecificArticles
};
