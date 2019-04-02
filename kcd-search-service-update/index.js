const getCodenamesAndTypesOfItems = require('../shared/utils/codenamesExtractor');
const indexers = require('../shared/searchIndexers');
const { setupConfiguration } = require('../shared/external/configuration');
const {
    VALID_OPERATIONS,
    VALID_REINDEX_OPERATIONS,
    ALL_CONTENT_TYPES
} = require('../shared/external/constants');

function validateEvent(event) {
    return event.eventType === 'kentico-cloud' &&
        event.data.webhook.items &&
        VALID_OPERATIONS.includes(event.subject);
}

module.exports = async (context, eventGridEvent) => {
    if (validateEvent(eventGridEvent)) {
        setupConfiguration(eventGridEvent.data.test);
        const items = getCodenamesAndTypesOfItems(eventGridEvent.data.webhook.items, ALL_CONTENT_TYPES);

        if (VALID_REINDEX_OPERATIONS.includes(eventGridEvent.subject)) {
            await indexers.reindexItems(items);
        } else {
            indexers.deleteIndexedItems(items);
        }
    } else {
        throw new Error('Validation failed. Unsupported event.');
    }
};
