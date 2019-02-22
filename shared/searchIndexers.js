const getSearchIndex = require('./external/searchIndex');
const getKenticoClient = require('./external/kenticoClient');
const createIndexableArticleChunks = require('./utils/indexableArticleChunksCreator');
const resolveItemInRichText = require('./utils/richTextResolver');

const EXCLUDED_FROM_SEARCH = 'excluded_from_search';

function isItemExcludedFromSearch(item) {
    return item
        .elements
        .visibility
        .value
        .some(taxonomyTerm => taxonomyTerm.codename === EXCLUDED_FROM_SEARCH);
}

async function reindexAllArticles() {
    await getSearchIndex().clearIndex();

    await getKenticoClient()
        .items()
        .type('article')
        .queryConfig({
            richTextResolver: resolveItemInRichText
        })
        .getPromise()
        .then(response => {
            const itemsToIndex = response.items.filter(item => !isItemExcludedFromSearch(item));

            itemsToIndex.forEach(article => resolveAndIndexArticle(article));
        });
}

async function reindexSpecificArticles(codenames) {
    await codenames.forEach(
        codename => getKenticoClient()
            .item(codename)
            .queryConfig({
                richTextResolver: resolveItemInRichText
            })
            .getPromise()
            .then(async ({ item }) => {
                await getSearchIndex().deleteBy({
                    filters: `id:${item.system.id}`
                });

                if (!isItemExcludedFromSearch(item)) {
                    await resolveAndIndexArticle(item)
                }
            }));
}

async function resolveAndIndexArticle(article) {
    if (article.content || article.introduction) {
        const resolvedIntroduction = article.introduction ? article.introduction.getHtml() : '';
        const resolvedContent = article.content ? article.content.getHtml() : '';
        const textToIndex = resolvedIntroduction + ' ' + resolvedContent;

        const articleChunks = createIndexableArticleChunks(article, textToIndex);
        await getSearchIndex().saveObjects(articleChunks);
    }
}

function deleteIndexedArticles(codenames) {
    codenames.forEach(codename => getSearchIndex().deleteBy({
        filters: `codename:${codename}`
    }));
}

module.exports = {
    reindexAllArticles,
    reindexSpecificArticles,
    deleteIndexedArticles
};
