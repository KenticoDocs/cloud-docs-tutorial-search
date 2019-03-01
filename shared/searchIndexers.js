const getSearchIndex = require('./external/searchIndex');
const getKenticoClient = require('./external/kenticoClient');
const ItemRecordsCreator = require('./utils/itemRecordsCreator');
const resolveItemInRichText = require('./utils/richTextResolver');
const { CONTENT_TYPES_TO_INDEX } = require('./external/constants');

const EXCLUDED_FROM_SEARCH = 'excluded_from_search';

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
        .types(CONTENT_TYPES_TO_INDEX)
        .queryConfig({
            richTextResolver: resolveItemInRichText
        })
        .getPromise()
        .then(async response => {
            const itemsToIndex = response.items.filter(item => !isItemExcludedFromSearch(item));

            for (const item of itemsToIndex) {
                await resolveAndIndexItem(item);
            }
        });
}

async function reindexItem(item) {
    await getSearchIndex().deleteBy({
        filters: `id:${item.system.id}`
    });

    if (!isItemExcludedFromSearch(item)) {
        await resolveAndIndexItem(item)
    }
}

async function reindexItems(codenames) {
    await codenames.forEach(
        codename => getKenticoClient()
            .item(codename)
            .queryConfig({
                richTextResolver: resolveItemInRichText
            })
            .getPromise()
            .then(async ({ item }) => {
                await reindexItem(item)
            }));
}

async function resolveAndIndexItem(item) {
    const itemRecordsCreator = new ItemRecordsCreator();
    const textToIndex = item.introduction.getHtml() + ' ' + item.content.getHtml();
    const itemRecords = itemRecordsCreator.createItemRecords(item, textToIndex);
    await getSearchIndex().saveObjects(itemRecords);
}

function deleteIndexedItems(codenames) {
    codenames.forEach(codename => getSearchIndex().deleteBy({
        filters: `codename:${codename}`
    }));
}

module.exports = {
    reindexAllItems,
    reindexItems,
    deleteIndexedItems
};
