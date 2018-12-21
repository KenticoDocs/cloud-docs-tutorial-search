const appKeys = require('./keys'); 
const algoliasearch = require('algoliasearch');

const searchClient = algoliasearch(
  appKeys.searchAppId,
  appKeys.adminApiKey,
);

const searchIndex = searchClient.initIndex(appKeys.index);

module.exports = searchIndex;
