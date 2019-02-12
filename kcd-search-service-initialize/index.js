const indexers = require('../shared/searchIndexers');
const { setupConfiguration } = require('../shared/external/configuration');

function validateEvent(event) {
    return event.subject === 'initialize';
}

module.exports = async (context, eventGridEvent) => {
    if (validateEvent(eventGridEvent)) {
        setupConfiguration(eventGridEvent.isTest);
        await indexers.reindexAllArticles();
    } else {
        throw new Error('Validation failed. Unsupported event.');
    }
};
