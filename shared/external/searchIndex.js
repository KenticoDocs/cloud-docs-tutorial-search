const algoliasearch = require('algoliasearch');
const { keys } = require('./configuration');

let searchClient;
let searchIndex;

function getSearchClient() {
    if (searchClient === undefined) {
        searchClient = algoliasearch(
            keys.searchAppId,
            keys.adminApiKey,
        );
    }

    return searchClient;
}

function getSearchIndex() {
    if (searchIndex === undefined) {
        searchIndex = getSearchClient().initIndex(keys.index);
    }

    return searchIndex;
}

module.exports = getSearchIndex;
