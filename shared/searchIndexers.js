const getSearchIndex = require('./external/searchIndex');
const getKenticoClient = require('./external/kenticoClient');
const ItemRecordsCreator = require('./utils/itemRecordsCreator');
const resolveItemInRichText = require('./utils/richTextResolver');
const insertLinkedCodeSamples = require('./utils/codeSamplesUtils');
const getRootCodenamesOfSingleItem = require('./utils/rootItemsGetter');
const { ROOT_CONTENT_TYPES, ALL_CONTENT_TYPES } = require('./external/constants');
const { CodeSampleMarkStart } = require('./utils/richTextLabels');

const EXCLUDED_FROM_SEARCH = 'excluded_from_search';

async function reindexAllItems() {
    await getSearchIndex().clearIndex();

    await getKenticoClient()
        .items()
        .types(ROOT_CONTENT_TYPES)
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

async function reindexItems(items) {
    const codenames = await getCodenamesOfRootItemsToIndex(items);

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

async function getCodenamesOfRootItemsToIndex(items) {
    const allItems = await getAllItems();
    const rootCodenames = new Set();

    items.forEach((item) => {
        const roots = getRootCodenamesOfSingleItem(item, allItems);
        roots.forEach(codename => rootCodenames.add(codename));
    });

    return rootCodenames;
}

async function getAllItems() {
    return getKenticoClient()
        .items()
        .types(ALL_CONTENT_TYPES)
        .depthParameter(0)
        .getPromise()
        .then(response =>
            response.linkedItems.concat(response.items)
        );
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

function isItemExcludedFromSearch(item) {
    return item
        .elements
        .visibility
        .value
        .some(taxonomyTerm => taxonomyTerm.codename === EXCLUDED_FROM_SEARCH);
}

async function deleteIndexedItem(item) {
    await getSearchIndex().deleteBy({
        filters: `id:${item.system.id}`
    });
}

function deleteIndexedItems(items) {
    items.forEach(item => getSearchIndex().deleteBy({
        filters: `codename:${item.codename}`
    }));
}

module.exports = {
    reindexAllItems,
    reindexItems,
    deleteIndexedItems
};
