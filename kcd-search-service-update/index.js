const getCodenamesOfItems = require('../shared/utils/codenamesExtractor');
const indexers = require('../shared/searchIndexers');
const { setupConfiguration } = require('../shared/external/configuration');
const {
    VALID_OPERATIONS,
    VALID_REINDEX_OPERATIONS,
    CONTENT_TYPES_TO_INDEX
} = require('../shared/external/constants');

function validateEvent(event) {
    return event.eventType === 'kentico-cloud' &&
        event.data.webhook.items &&
        VALID_OPERATIONS.includes(event.subject);
}

module.exports = async (context, eventGridEvent) => {
    if (validateEvent(eventGridEvent)) {
        setupConfiguration(eventGridEvent.data.test);
        const codenames = getCodenamesOfItems(eventGridEvent.data.webhook.items, CONTENT_TYPES_TO_INDEX);

        if (VALID_REINDEX_OPERATIONS.includes(eventGridEvent.subject)) {
            await indexers.reindexSpecificItems(codenames);
        } else {
            indexers.deleteIndexedItems(codenames);
        }
    } else {
        throw new Error('Validation failed. Unsupported event.');
    }
};
