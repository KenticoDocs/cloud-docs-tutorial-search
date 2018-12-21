const getCodenamesOfItems = require('../shared/utils/codenamesExtractor');
const indexers = require('../shared/searchIndexers');

function validateEvent(event) {
  return event.eventType === 'kentico' && 
    event.data.items && 
    (event.subject === 'publish' || event.subject === 'unpublish' || event.subject === 'archive');
}

module.exports = async (context, eventGridEvent) => {
  if (validateEvent(eventGridEvent)) {
    const codenames = getCodenamesOfItems(eventGridEvent.data.items, 'article');
    await indexers.deleteIndexedArticles(codenames);
    await indexers.indexSpecificArticles(codenames);
  } else {
    throw 'Validation failed. Unsupported event.';
  }
};