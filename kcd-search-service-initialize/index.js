const indexers = require('../shared/searchIndexers');

function validateEvent(event) {
  return event.subject === 'initialize';
}

module.exports = async (context, eventGridEvent) => {
    try {
      if (validateEvent(eventGridEvent)) {
        await indexers.reindexAllArticles();
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