const appKeys = require('./keys');
const algoliasearch = require('algoliasearch');

let searchClient;
let searchIndex;

function getSearchClient() {
    if (searchClient === null) {
        searchClient = algoliasearch(
            appKeys.searchAppId,
            appKeys.adminApiKey,
        );
    }

    return searchClient;
}

function getSearchIndex() {
    if (searchIndex === null) {
        searchIndex = getSearchClient().initIndex(appKeys.index);
    }

    return searchIndex;
}

module.exports = getSearchIndex;
