const axios = require('axios');
const KenticoKontent = require('@kentico/kontent-delivery');

const getDeliveryClient = require('./external/kenticoClient');
const getRootCodenamesOfSingleItem = require('./utils/rootItemsGetter');
const resolveItemInRichText = require('./utils/richTextResolver');
const Configuration = require('./external/configuration');
const { getItemRecordsCreator } = require('./utils/itemRecordsCreator');
const { insertLinkedCodeSamples } = require('./utils/codeSamplesUtils');
const { CodeSampleMarkStart } = require('./utils/richTextLabels');
const { storeRecordsToBlobStorageAsync } = require('./external/storeRecordsToBlobStorage');
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
    static async splitAllItemsToRecordsAsync() {
        await axios.get(Configuration.keys.clearIndexUrl);

        const response = await getDeliveryClient()
            .items()
            .types(ROOT_CONTENT_TYPES)
            .depthParameter(DEPTH_FOR_ITEMS_FETCH)
            .queryConfig({
                richTextResolver: resolveItemInRichText,
            })
            .toPromise();

        for (const item of response.items) {
            await processItemAsync(item, response.linkedItems, true);
        }

        return response;
    }

    static async splitItemsToRecordsAsync(items) {
        const codenames = await getCodenamesOfRootItemsToIndexAsync(items);
        const client = getDeliveryClient();

        for (const codename of codenames) {
            try {
                const response = await client.item(codename)
                    .depthParameter(DEPTH_FOR_ITEMS_FETCH)
                    .queryConfig({
                        richTextResolver: resolveItemInRichText,
                    })
                    .toPromise();

                await processItemAsync(response.item, response.linkedItems);
            } catch (error) {
                await handleErrorAsync(error, codename)
            }
        }
    }
}

async function processItemAsync(item, linkedItems, initialize = false) {
    if (!isItemExcludedFromSearch(item)) {
        const textToIndex = getResolvedTextToIndex(item, linkedItems);
        const records = createRecordsFromItem(item, textToIndex);

        await storeRecordsToBlobStorageAsync(records, item, initialize);
    }
}

async function getCodenamesOfRootItemsToIndexAsync(items) {
    const allItems = await getAllItemsAsync();
    const rootCodenames = new Set();

    items.forEach((item) => {
        const roots = getRootCodenamesOfSingleItem(item, allItems);
        roots.forEach(codename => rootCodenames.add(codename));
    });

    return rootCodenames;
}

async function getAllItemsAsync() {
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

function getResolvedTextToIndex(item, linkedItems) {
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

function createRecordsFromItem(item, text) {
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

async function handleErrorAsync(error, codename) {
    if (error instanceof KenticoKontent.DeliveryError && error.errorCode === 100) {
        const notFoundItem = {
            system: {
                codename,
                id: 'not_found_' + codename,
            },
        };
        await storeRecordsToBlobStorageAsync([], notFoundItem);
    } else {
        throw error;
    }
}

module.exports = SplitService;
