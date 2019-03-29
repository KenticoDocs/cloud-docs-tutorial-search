const getSearchIndex = require('./external/searchIndex');
const getKenticoClient = require('./external/kenticoClient');
const ItemRecordsCreator = require('./utils/itemRecordsCreator');
const resolveItemInRichText = require('./utils/richTextResolver');
const insertLinkedCodeSamples = require('./utils/codeSamplesUtils');
const { CONTENT_TYPES_TO_INDEX } = require('./external/constants');
const { CodeSampleMarkStart } = require('./utils/richTextLabels');

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
        .depthParameter(4)
        .queryConfig({
            richTextResolver: resolveItemInRichText
        })
        .getPromise()
        .then(async (response) => {
            const itemsToIndex = response.items.filter(item => !isItemExcludedFromSearch(item));

            for (const item of itemsToIndex) {
                await resolveAndIndexItem(item, response.linkedItems);
            }

            return response;
        });
}

async function reindexItems(codenames) {
    await codenames.forEach(
        codename => getKenticoClient()
            .item(codename)
            .depthParameter(4)
            .queryConfig({
                richTextResolver: resolveItemInRichText
            })
            .getPromise()
            .then(async (response) => {
                await reindexItem(response.item, response.linkedItems);

                return response;
            }));
}

async function reindexItem(item, linkedItems) {
    await deleteIndexedItem(item);

    if (!isItemExcludedFromSearch(item)) {
        await resolveAndIndexItem(item, linkedItems)
    }
}

async function resolveAndIndexItem(item, linkedItems) {
    let textToIndex = item.introduction.getHtml() + ' ' + item.content.getHtml();

    if (textToIndex.includes(CodeSampleMarkStart)) {
        textToIndex = insertLinkedCodeSamples(textToIndex, linkedItems);
    }

    await indexItem(item, textToIndex);
}

async function indexItem(item, text) {
    const itemRecordsCreator = new ItemRecordsCreator();

    const itemRecords = itemRecordsCreator.createItemRecords(item, text);
    await getSearchIndex().saveObjects(itemRecords);
}

async function deleteIndexedItem(item) {
    await getSearchIndex().deleteBy({
        filters: `id:${item.system.id}`
    });
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
