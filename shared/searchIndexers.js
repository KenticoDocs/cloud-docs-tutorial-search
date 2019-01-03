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
    await deleteIndexedArticles(codenames);
    await indexSpecificArticles(codenames);
}

async function indexSpecificArticles(codenames) {
    codenames.forEach(codename => fetchAndIndexArticle(codename));
}

async function fetchAndIndexArticle(codename) {
    await kenticoClient
        .item(codename)
        .queryConfig({
            richTextResolver: resolveItemInRichText
        })
        .getPromise()
        .then(response => resolveAndIndexArticle(response.item));
}

async function resolveAndIndexArticle(article) {
    if (article.content) {
        const resolvedArticle = resolveItemsInRichText(article);
        await indexArticle(resolvedArticle);
    }
}

function resolveItemsInRichText(article) {
    return {
        ...article,
        content: {
            value: article.content.getHtml()
        }
    }
}

async function indexArticle(article) {
    const articleObject = createIndexableArticle(article);
    await searchIndex.saveObjects(articleObject);
}

async function deleteIndexedArticles(codenames) {
    codenames.map(codename => deleteIndexedArticle(codename));
}

async function deleteIndexedArticle(codename) {
    await searchIndex.deleteBy({
        filters: `codename:${codename}`
    });
}

module.exports = {
    reindexAllArticles,
    reindexSpecificArticles
};
