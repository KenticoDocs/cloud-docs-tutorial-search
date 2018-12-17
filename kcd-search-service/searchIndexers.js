const searchIndex = require('./external/searchClient');
const kenticoClient = require('./external/kenticoClient');
const createIndexableArticle = require('./utils/indexableArticleCreator');
const resolveItemInRichText = require('./utils/richTextResolver');

function reindexAllArticles() {
    searchIndex.clearIndex();

    kenticoClient
        .items()
        .type('article')
        .queryConfig({
            richTextResolver: resolveItemInRichText
        })
        .getPromise()
        .then(response =>
            response.items.forEach(article => resolveAndIndexArticle(article)));
}

function indexSpecificArticles(codenames) {
    codenames.forEach(codename => fetchAndIndexArticle(codename));
}

function fetchAndIndexArticle(codename) {
    kenticoClient
        .item(codename)
        .queryConfig({
            richTextResolver: resolveItemInRichText
        })
        .getPromise()
        .then(response => resolveAndIndexArticle(response.item));
}

function resolveAndIndexArticle(article) {
    if (article.content) {
        const resolvedArticle = resolveItemsInRichText(article);
        indexArticle(resolvedArticle);
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

function indexArticle(article) {
    const articleObject = createIndexableArticle(article);
    searchIndex.saveObjects(articleObject);
}

function deleteIndexedArticles(codenames) {
    codenames.map(codename => deleteIndexedArticle(codename));
}

function deleteIndexedArticle(codename) {
    searchIndex.deleteBy({
        filters: `codename:${codename}`
    });
}

module.exports = {
    reindexAllArticles,
    indexSpecificArticles,
    deleteIndexedArticles,
}
