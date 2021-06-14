const axios = require('axios');
const KenticoKontent = require('@kentico/kontent-delivery');

const getDeliveryClient = require('./external/kenticoClient');
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
    ALWAYS_INCLUDE_CONTENT_TYPES_IN_SEARCH,
    TERM_DEFINITION_CONTENT_TYPE,
    RELEASE_NOTE_CONTENT_TYPE,
    TRAINING_COURSE_CONTENT_TYPE
} = require('./external/constants');

const DEPTH_FOR_ITEMS_FETCH = 10;

class SplitService {
    static async splitAllItemsToRecords() {
        await axios.get(Configuration.keys.clearIndexUrl);

        await getDeliveryClient()
            .items()
            .types(ROOT_CONTENT_TYPES)
            .depthParameter(DEPTH_FOR_ITEMS_FETCH)
            .queryConfig({
                richTextResolver: resolveItemInRichText,
            })
            .toPromise()
            .then(async (response) => {
                for (const item of response.items) {
                    await processItem(item, response.linkedItems, true);
                }

                return response;
            });
    }

    static async splitItemsToRecords(items) {
        const codenames = await getCodenamesOfRootItemsToIndex(items);

        await codenames.forEach(codename => getDeliveryClient()
            .item(codename)
            .depthParameter(DEPTH_FOR_ITEMS_FETCH)
            .queryConfig({
                richTextResolver: resolveItemInRichText,
            })
            .toPromise()
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
    return getDeliveryClient()
        .items()
        .types(ALL_CONTENT_TYPES)
        .depthParameter(0)
        .toPromise()
        .then(response => {
                const items = response.items;

                for (const linkedItemKey in response.linkedItems) {
                    items.push(response.linkedItems[linkedItemKey]);
                }

                return items;
            }
        );
}

function getTextToIndexForTermDefinition(item) {
    return item.definition.resolveHtml();
}

function getTextToIndexForReleaseNote(item, linkedItems) {
    let textToIndex = item.content.resolveHtml();

    if (textToIndex.includes(CodeSampleMarkStart)) {
        textToIndex = insertLinkedCodeSamples(textToIndex, linkedItems);
    }

    return textToIndex;
}

function getTextToIndexForTrainingCourse(item, linkedItems) {
    if (item.system.type !== TRAINING_COURSE_CONTENT_TYPE) {
        throw Error(`Content item '${item.system.type}' is not of training type '${TRAINING_COURSE_CONTENT_TYPE}'. It is '${item.system.type}'`);
    }
    const title = item.title.value;
    const description = item.description.resolveHtml();
    const introduction = item.introduction.resolveHtml();

    return `${title} ${description} ${introduction}`;
}

function getTextToIndexDefault(item, linkedItems) {
    let textToIndex = item.introduction.resolveHtml() + ' ' + item.content.resolveHtml();

    if (textToIndex.includes(CodeSampleMarkStart)) {
        textToIndex = insertLinkedCodeSamples(textToIndex, linkedItems);
    }

    return textToIndex;
}

async function getResolvedTextToIndex(item, linkedItems) {
    if (item.system.type === TERM_DEFINITION_CONTENT_TYPE) {
        return getTextToIndexForTermDefinition(item);
    }
    if (item.system.type === RELEASE_NOTE_CONTENT_TYPE) {
        return getTextToIndexForReleaseNote(item, linkedItems);
    }
    if (item.system.type === TRAINING_COURSE_CONTENT_TYPE) {
        return getTextToIndexForTrainingCourse(item, linkedItems);
    }

    return getTextToIndexDefault(item, linkedItems);
}

async function createRecordsFromItem(item, text) {
    return getItemRecordsCreator().createItemRecords(item, text);
}

function isItemExcludedFromSearch(item) {
    if (item.system.type === TRAINING_COURSE_CONTENT_TYPE) {
        // always index training courses
        return false;
    }
    if (item.visibility && item.visibility.value) {
        // content item has exclude from search element = index it based on that value
        return item
        .visibility
        .value
        .some(taxonomyTerm => taxonomyTerm.codename === EXCLUDED_FROM_SEARCH);
    }
    // content item does not have visibility value
    if (ALWAYS_INCLUDE_CONTENT_TYPES_IN_SEARCH.includes(item.system.type)) {
        // item should be indexed
        return false;
    }

    // do not index item
    return true;
}

async function handleError(error, codename) {
    if (error instanceof KenticoKontent.DeliveryError && error.errorCode === 100) {
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
