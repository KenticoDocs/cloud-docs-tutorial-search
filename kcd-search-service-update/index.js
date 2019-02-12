const getCodenamesOfItems = require('../shared/utils/codenamesExtractor');
const indexers = require('../shared/searchIndexers');
const appKeys = require('../shared/external/keys');

function validateEvent(event) {
    return event.eventType === 'kentico' &&
        event.data.items &&
        (event.subject === 'publish' || event.subject === 'unpublish' || event.subject === 'archive');
}

module.exports = async (context, eventGridEvent) => {
    if (validateEvent(eventGridEvent)) {
        appKeys.SetupConfiguration(eventGridEvent.isTest);
        const codenames = getCodenamesOfItems(eventGridEvent.data.items, 'article');
        await indexers.reindexSpecificArticles(codenames);
    } else {
        throw new Error('Validation failed. Unsupported event.');
    }
};
