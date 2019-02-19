const getSearchIndex = require('./external/searchIndex');
const getKenticoClient = require('./external/kenticoClient');
const createIndexableArticleChunks = require('./utils/indexableArticleChunksCreator');
const resolveItemInRichText = require('./utils/richTextResolver');

async function reindexAllArticles() {
    await getSearchIndex().clearIndex();

    await getKenticoClient()
        .items()
        .type('article')
        .queryConfig({
            richTextResolver: resolveItemInRichText
        })
        .getPromise()
        .then(response => response.items.forEach(
            article => resolveAndIndexArticle(article)));
}

async function reindexSpecificArticles(codenames) {
    await codenames.forEach(
        codename => getKenticoClient()
            .item(codename)
            .queryConfig({
                richTextResolver: resolveItemInRichText
            })
            .getPromise()
            .then(async response => {
                await getSearchIndex().deleteBy({
                    filters: `id:${response.item.system.id}`
                });

                await resolveAndIndexArticle(response.item)
            }));
}

async function resolveAndIndexArticle(article) {
    if (article.content) {
        const articleWithResolvedRichTextComponents = {
            ...article,
            content: {
                value: article.content.getHtml()
            }
        };
        const articleChunks = createIndexableArticleChunks(articleWithResolvedRichTextComponents);
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
