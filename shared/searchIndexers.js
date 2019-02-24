const getSearchIndex = require('./external/searchIndex');
const getKenticoClient = require('./external/kenticoClient');
const createItemRecords = require('./utils/itemRecordsCreator');
const resolveItemInRichText = require('./utils/richTextResolver');

const EXCLUDED_FROM_SEARCH = 'excluded_from_search';
const CONTENT_ITEMS_TO_INDEX = ['article', 'scenario'];

function isItemExcludedFromSearch(item) {
    return item
        .elements
        .visibility
        .value
        .some(taxonomyTerm => taxonomyTerm.codename === EXCLUDED_FROM_SEARCH);
}

async function reindexAllItems() {
    await getSearchIndex().clearIndex();

    await getKenticoClient()
        .items()
        .types(CONTENT_ITEMS_TO_INDEX)
        .queryConfig({
            richTextResolver: resolveItemInRichText
        })
        .getPromise()
        .then(response => {
            const itemsToIndex = response.items.filter(item => !isItemExcludedFromSearch(item));

            itemsToIndex.forEach(item => resolveAndIndexItem(item));
        });
}

async function reindexSpecificItems(codenames) {
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
                    await resolveAndIndexItem(item)
                }
            }));
}

async function resolveAndIndexItem(item) {
    if (item.content) {
        let textToIndex = '';

        if (item.system.type === 'article' && item.introduction) {
            const resolvedIntroduction = item.introduction ? item.introduction.getHtml() : '';
            const resolvedContent = item.content ? item.content.getHtml() : '';
            textToIndex = resolvedIntroduction + ' ' + resolvedContent;
        } else {
            textToIndex = item.content ? item.content.getHtml() : '';
        }

        const itemRecords = createItemRecords(item, textToIndex);
        await getSearchIndex().saveObjects(itemRecords);
    }
}

function deleteIndexedItems(codenames) {
    codenames.forEach(codename => getSearchIndex().deleteBy({
        filters: `codename:${codename}`
    }));
}

module.exports = {
    reindexAllItems,
    reindexSpecificItems,
    deleteIndexedItems
};
