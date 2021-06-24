import {
    ContentItem,
    ContentItemSystemAttributes,
    DeliveryError,
    IContentItemsContainer,
    TaxonomyTerms
} from '@kentico/kontent-delivery';

import axios from 'axios';

import { getItemRecordsCreator } from './utils/itemRecordsCreator';
import { insertLinkedCodeSamples } from './utils/codeSamplesUtils';
import { CodeSampleMarkStart } from './utils/richTextLabels';
import { storeRecordsToBlobStorageAsync } from './external/storeRecordsToBlobStorage';
import {
    ROOT_CONTENT_TYPES,
    ALL_CONTENT_TYPES,
    EXCLUDED_FROM_SEARCH,
    ALWAYS_INCLUDE_CONTENT_TYPES_IN_SEARCH,
    TERM_DEFINITION_CONTENT_TYPE,
    RELEASE_NOTE_CONTENT_TYPE,
    TRAINING_COURSE_CONTENT_TYPE
} from './external/constants';
import { Configuration } from './external/configuration';
import { getDeliveryClient } from './external/kenticoClient';
import { resolveItemInRichText } from './utils/richTextResolver';
import { getRootCodenamesOfSingleItem } from './utils/rootItemsGetter';
import { IRelevantItem } from './utils/itemFilter';

const DEPTH_FOR_ITEMS_FETCH = 10;

export class SplitService {
    static async splitAllItemsToRecordsAsync() {
        await axios.get(Configuration.clearIndexUrl);

        const response = await getDeliveryClient()
            .items()
            .types(ROOT_CONTENT_TYPES)
            .depthParameter(DEPTH_FOR_ITEMS_FETCH)
            .queryConfig({
                richTextResolver: resolveItemInRichText
            })
            .toPromise();

        for (const item of response.items) {
            await processItemAsync(item, response.linkedItems, true);
        }

        return response;
    }

    static async splitItemsToRecordsAsync(items: IRelevantItem[]) {
        const codenames = await getCodenamesOfRootItemsToIndexAsync(items);
        const client = getDeliveryClient();

        for (const codename of codenames) {
            try {
                const response = await client
                    .item(codename)
                    .depthParameter(DEPTH_FOR_ITEMS_FETCH)
                    .queryConfig({
                        richTextResolver: resolveItemInRichText
                    })
                    .toPromise();

                await processItemAsync(response.item, response.linkedItems);
            } catch (error) {
                await handleErrorAsync(error, codename);
            }
        }
    }
}

async function processItemAsync(item: ContentItem, linkedItems: IContentItemsContainer, initialize = false) {
    if (!isItemExcludedFromSearch(item)) {
        const textToIndex = getResolvedTextToIndex(item, linkedItems);
        const records = createRecordsFromItem(item, textToIndex);

        await storeRecordsToBlobStorageAsync(records, item, initialize);
    }
}

async function getCodenamesOfRootItemsToIndexAsync(items: IRelevantItem[]): Promise<Set<string>> {
    const allItems = await getAllItemsAsync();
    const rootCodenames = new Set<string>();

    items.forEach((item) => {
        const roots = getRootCodenamesOfSingleItem(item, allItems);
        roots.forEach((codename: string) => rootCodenames.add(codename));
    });

    return rootCodenames;
}

async function getAllItemsAsync() {
    return getDeliveryClient()
        .items()
        .types(ALL_CONTENT_TYPES)
        .depthParameter(0)
        .toPromise()
        .then((response) => {
            const items = response.items;

            // tslint:disable-next-line
            for (const linkedItemKey in response.linkedItems) {
                items.push(response.linkedItems[linkedItemKey]);
            }

            return items;
        });
}

function getTextToIndexForTermDefinition(item: ContentItem) {
    return item.definition.resolveHtml();
}

function getTextToIndexForReleaseNote(item: ContentItem, linkedItems: IContentItemsContainer) {
    let textToIndex = item.content.resolveHtml();

    if (textToIndex.includes(CodeSampleMarkStart)) {
        textToIndex = insertLinkedCodeSamples(textToIndex, linkedItems);
    }

    return textToIndex;
}

function getTextToIndexForTrainingCourse(item: ContentItem, linkedItems: IContentItemsContainer) {
    if (item.system.type !== TRAINING_COURSE_CONTENT_TYPE) {
        throw Error(
            `Content item '${item.system.type}' is not of training type '${TRAINING_COURSE_CONTENT_TYPE}'. It is '${item.system.type}'`
        );
    }
    const description = item.description.resolveHtml();
    const introduction = item.introduction.resolveHtml();

    return `${introduction} ${description}`;
}

function getTextToIndexDefault(item: ContentItem, linkedItems: IContentItemsContainer) {
    let textToIndex = item.introduction.resolveHtml() + ' ' + item.content.resolveHtml();

    if (textToIndex.includes(CodeSampleMarkStart)) {
        textToIndex = insertLinkedCodeSamples(textToIndex, linkedItems);
    }

    return textToIndex;
}

function getResolvedTextToIndex(item: ContentItem, linkedItems: IContentItemsContainer) {
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

function createRecordsFromItem(item: ContentItem, text: string) {
    return getItemRecordsCreator().createItemRecords(item, text);
}

function isItemExcludedFromSearch(item: ContentItem) {
    if (item.system.type === TRAINING_COURSE_CONTENT_TYPE) {
        // always index training courses
        return false;
    }
    if (item.visibility && item.visibility.value) {
        // content item has exclude from search element = index it based on that value
        return item.visibility.value.some(
            (taxonomyTerm: TaxonomyTerms) => taxonomyTerm.codename === EXCLUDED_FROM_SEARCH
        );
    }
    // content item does not have visibility value
    if (ALWAYS_INCLUDE_CONTENT_TYPES_IN_SEARCH.includes(item.system.type)) {
        // item should be indexed
        return false;
    }

    // do not index item
    return true;
}

async function handleErrorAsync(error: any, codename: string) {
    if (error instanceof DeliveryError && error.errorCode === 100) {
        const notFoundItem: ContentItem = new ContentItem();

        notFoundItem.system = new ContentItemSystemAttributes({
            codename,
            collection: 'x',
            id: 'not_found_' + codename, // needed to remove records from algolia
            language: 'x',
            lastModified: new Date(),
            name: 'x',
            sitemapLocations: [],
            type: 'x'
        });
        await storeRecordsToBlobStorageAsync([], notFoundItem);
    } else {
        throw error;
    }
}
