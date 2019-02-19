const getCodenamesOfItems = require('../shared/utils/codenamesExtractor');
const indexers = require('../shared/searchIndexers');
const { setupConfiguration } = require('../shared/external/configuration');

const validEventSubjects = ['publish', 'upsert', 'unpublish', 'archive'];

function validateEvent(event) {
    return event.eventType === 'kentico-cloud' &&
        event.data.items &&
        validEventSubjects.includes(event.subject);
}

module.exports = async (context, eventGridEvent) => {
    if (validateEvent(eventGridEvent)) {
        setupConfiguration(eventGridEvent.test);
        const codenames = getCodenamesOfItems(eventGridEvent.data.items, 'article');

        if (eventGridEvent.subject === 'publish' || eventGridEvent.subject === 'upsert') {
            await indexers.reindexSpecificArticles(codenames);
        } else {
            await indexers.deleteIndexedArticles(codenames);
        }
    } else {
        throw new Error('Validation failed. Unsupported event.');
    }
};
