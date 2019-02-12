const algoliasearch = require('algoliasearch');
let keys = require('./keys');

let searchClient;
let searchIndex;

function getSearchClient() {
    if (searchClient === undefined) {
        searchClient = algoliasearch(
            keys.keys.searchAppId,
            keys.keys.adminApiKey,
        );
    }

    return searchClient;
}

function getSearchIndex() {
    if (searchIndex === undefined) {
        searchIndex = getSearchClient().initIndex(keys.keys.index);
    }

    return searchIndex;
}

module.exports = getSearchIndex;
