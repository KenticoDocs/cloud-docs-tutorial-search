const indexers = require('../shared/searchIndexers');
const appKeys = require('../shared/external/keys');

function validateEvent(event) {
    return event.subject === 'initialize';
}

module.exports = async (context, eventGridEvent) => {
    if (validateEvent(eventGridEvent)) {
        appKeys.setupConfiguration(eventGridEvent.isTest);
        await indexers.reindexAllArticles();
    } else {
        throw new Error('Validation failed. Unsupported event.');
    }
};
