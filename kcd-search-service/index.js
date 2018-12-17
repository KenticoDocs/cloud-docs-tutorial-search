const getCodenamesOfItems = require('./utils/codenamesExtractor');
const validateEvent = require('./eventValidator');
const indexers = require('./searchIndexers');

module.exports = (context, event) => {
  const parsedReq = validateEvent(context, event);

  if (parsedReq[0].subject && parsedReq[0].data) {
    const subject = parsedReq[0].subject;
    const items = parsedReq[0].data.items;

    if (subject === 'initialize') {
      indexers.reindexAllArticles();
    }

    if (items && (subject === 'publish' || subject === 'unpublish')) {
      const codenames = getCodenamesOfItems(items, 'article');
      indexers.indexSpecificArticles(codenames);
    }

    if (items && subject === 'archive') {
      const codenames = getCodenamesOfItems(items, 'article');
      indexers.deleteIndexedArticles(codenames);
      indexers.indexSpecificArticles(codenames);
    }
  }
};
