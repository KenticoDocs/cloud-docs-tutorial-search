const getCodenamesOfItems = require('../shared/utils/codenamesExtractor');
const indexers = require('../shared/searchIndexers');
const { setupConfiguration } = require('../shared/external/configuration');

const VALID_REINDEX_OPERATIONS = ['publish', 'upsert', 'restore_publish'];
const VALID_DELETE_OPERATIONS = ['unpublish', 'archive'];
const VALID_OPERATIONS = VALID_REINDEX_OPERATIONS.concat(VALID_DELETE_OPERATIONS);

const CONTENT_ITEMS_TO_INDEX = ['article', 'scenario'];

function validateEvent(event) {
    return event.eventType === 'kentico-cloud' &&
        event.data.webhook.items &&
        VALID_OPERATIONS.includes(event.subject);
}

module.exports = async (context, eventGridEvent) => {
    if (validateEvent(eventGridEvent)) {
        setupConfiguration(eventGridEvent.data.test);
        const codenames = getCodenamesOfItems(eventGridEvent.data.webhook.items, CONTENT_ITEMS_TO_INDEX);

        if (VALID_REINDEX_OPERATIONS.includes(eventGridEvent.subject)) {
            await indexers.reindexSpecificItems(codenames);
        } else {
            indexers.deleteIndexedItems(codenames);
        }
    } else {
        throw new Error('Validation failed. Unsupported event.');
    }
};
