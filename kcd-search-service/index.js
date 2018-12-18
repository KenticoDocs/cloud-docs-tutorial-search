const getCodenamesOfItems = require('./utils/codenamesExtractor');
const indexers = require('./searchIndexers');

const SubscriptionValidationEvent = "Microsoft.EventGrid.SubscriptionValidationEvent";

function isNonEmptyKenticoEvent(event) {
  return event.eventType === 'kentico' && event.data.items;
}

module.exports = (context, event) => {
  const singleEvent = event.body[0];

  if (singleEvent.eventType === SubscriptionValidationEvent) {
    context.res = {
      body: {
        validationResponse: singleEvent.data.validationCode
      }
    };

  } else if (singleEvent.subject && singleEvent.data) {

    if (singleEvent.subject === 'initialize') {
      indexers.reindexAllArticles();

    } else if (isNonEmptyKenticoEvent(singleEvent) && (subject === 'publish' || subject === 'unpublish')) {
      const codenames = getCodenamesOfItems(singleEvent.data.items, 'article');
      indexers.indexSpecificArticles(codenames);

    } else if (isNonEmptyKenticoEvent(singleEvent) && subject === 'archive') {

      const codenames = getCodenamesOfItems(singleEvent.data.items, 'article');
      indexers.deleteIndexedArticles(codenames);
      indexers.indexSpecificArticles(codenames);
    }
  }

  context.done();
};
