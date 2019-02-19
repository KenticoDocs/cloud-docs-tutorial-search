const algoliasearch = require('algoliasearch');
const { keys } = require('./configuration');

function getSearchClient() {
    return algoliasearch(keys.searchAppId, keys.adminApiKey);
}

function getSearchIndex() {
    return getSearchClient().initIndex(keys.index);
}

module.exports = getSearchIndex;
