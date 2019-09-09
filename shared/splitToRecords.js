const axios = require('axios');
const getKenticoClient = require('./external/kenticoClient');
const getRootCodenamesOfSingleItem = require('./utils/rootItemsGetter');
const resolveItemInRichText = require('./utils/richTextResolver');
const Configuration = require('./external/configuration');
const { getItemRecordsCreator } = require('./utils/itemRecordsCreator');
const { insertLinkedCodeSamples } = require('./utils/codeSamplesUtils');
const { CodeSampleMarkStart } = require('./utils/richTextLabels');
const { storeRecordsToBlobStorage } = require('./external/storeRecordsToBlobStorage');
const {
    ROOT_CONTENT_TYPES,
    ALL_CONTENT_TYPES,
    EXCLUDED_FROM_SEARCH,
} = require('./external/constants');

class SplitService {
    static async splitAllItemsToRecords() {
        await axios.get(Configuration.keys.clearIndexUrl);

        await getKenticoClient()
            .items()
            .types(ROOT_CONTENT_TYPES)
            .depthParameter(4)
            .queryConfig({
                richTextResolver: resolveItemInRichText,
            })
            .getPromise()
            .then(async (response) => {
                for (const item of response.items) {
                    await processItem(item, response.linkedItems, true);
                }

                return response;
            });
    }

    static async splitItemsToRecords(items) {
        const codenames = await getCodenamesOfRootItemsToIndex(items);

        await codenames.forEach(codename => getKenticoClient()
            .item(codename)
            .depthParameter(4)
            .queryConfig({
                richTextResolver: resolveItemInRichText,
            })
            .getPromise()
            .then(async (response) => {
                await processItem(response.item, response.linkedItems);

                return response;
            })
            .catch((error) => handleError(error, codename)));
    }
}

async function processItem(item, linkedItems, initialize = false) {
    if (!isItemExcludedFromSearch(item)) {
        const textToIndex = await getResolvedTextToIndex(item, linkedItems);
        const records = await createRecordsFromItem(item, textToIndex);

        await storeRecordsToBlobStorage(records, item, initialize);
    }
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
            response.items.concat(response.linkedItems),
        );
}

async function getResolvedTextToIndex(item, linkedItems) {
    let textToIndex = item.introduction.getHtml() + ' ' + item.content.getHtml();

    if (textToIndex.includes(CodeSampleMarkStart)) {
        textToIndex = insertLinkedCodeSamples(textToIndex, linkedItems);
    }

    return textToIndex;
}

async function createRecordsFromItem(item, text) {
    return getItemRecordsCreator().createItemRecords(item, text);
}

function isItemExcludedFromSearch(item) {
    return item
        .elements
        .visibility
        .value
        .some(taxonomyTerm => taxonomyTerm.codename === EXCLUDED_FROM_SEARCH);
}

async function handleError(error, codename) {
    if (error.errorCode === 100) {
        const notFoundItem = {
            system: {
                codename,
                id: 'not_found_' + codename,
            },
        };
        await storeRecordsToBlobStorage([], notFoundItem);
    } else {
        throw error;
    }
}

module.exports = SplitService;
