const getCodenamesOfItems = require('../shared/utils/codenamesExtractor');
const indexers = require('../shared/searchIndexers');

function validateEvent(event) {
  return event.eventType === 'kentico' && 
    event.data.items && 
    (event.subject === 'publish' || event.subject === 'unpublish' || event.subject === 'archive');
}

module.exports = async (context, eventGridEvent) => {
    try {
        if (validateEvent(eventGridEvent)) {
            const codenames = getCodenamesOfItems(eventGridEvent.data.items, 'article');
            await indexers.deleteIndexedArticles(codenames);
            await indexers.indexSpecificArticles(codenames);
        } else {
          return {
            status: 400,
            body: 'Validation failed. Unsupported event.'
          };
        }
      } catch (exception) {
        context.error(exception.message);
          
        return {
          status: 500,
          body: 'The request was unsuccessful.'
        };
      }
  
      return { 
        status: 200 
      };
};