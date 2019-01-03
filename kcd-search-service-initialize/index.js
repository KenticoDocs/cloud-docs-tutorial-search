const indexers = require('../shared/searchIndexers');

function validateEvent(event) {
    return event.subject === 'initialize';
}

module.exports = async (context, eventGridEvent) => {
    if (validateEvent(eventGridEvent)) {
        await indexers.reindexAllArticles();
    } else {
        throw 'Validation failed. Unsupported event.';
    }
};
