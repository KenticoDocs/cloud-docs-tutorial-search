const getCodenamesOfItems = require('../shared/utils/codenamesExtractor');
const indexers = require('../shared/searchIndexers');
const { setupConfiguration } = require('../shared/external/configuration');

const validReindexOperations = ['publish', 'upsert', 'restore_publish'];
const validDeleteOperations = ['unpublish', 'archive'];
const validOperations = validReindexOperations.concat(validDeleteOperations);

function validateEvent(event) {
    return event.eventType === 'kentico-cloud' &&
        event.data.webhook.items &&
        validOperations.includes(event.subject);
}

module.exports = async (context, eventGridEvent) => {
    if (validateEvent(eventGridEvent)) {
        setupConfiguration(eventGridEvent.data.test);
        const codenames = getCodenamesOfItems(eventGridEvent.data.webhook.items, 'article');

        if (validReindexOperations.includes(eventGridEvent.subject)) {
            await indexers.reindexSpecificArticles(codenames);
        } else {
            indexers.deleteIndexedArticles(codenames);
        }
    } else {
        throw new Error('Validation failed. Unsupported event.');
    }
};
