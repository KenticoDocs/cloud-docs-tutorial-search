const getRelevantItems = require('../shared/utils/itemFilter');
const indexers = require('../shared/searchIndexers');
const { setupConfiguration } = require('../shared/external/configuration');
const {
    VALID_OPERATIONS,
    ALL_CONTENT_TYPES,
} = require('../shared/external/constants');

function validateEvent(event) {
    return event.eventType === 'kentico-cloud' &&
        event.data.webhook.items &&
        VALID_OPERATIONS.includes(event.subject);
}

module.exports = async (context, eventGridEvent) => {
    try {
        if (validateEvent(eventGridEvent)) {
            setupConfiguration(eventGridEvent.data.test);
            const items = getRelevantItems(eventGridEvent.data.webhook.items, ALL_CONTENT_TYPES);
            await indexers.reindexItems(items);
        } else {
            throw new Error('Validation failed. Unsupported event.');
        }
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};
