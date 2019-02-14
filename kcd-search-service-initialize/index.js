const indexers = require('../shared/searchIndexers');
const { setupConfiguration } = require('../shared/external/configuration');

module.exports = async (context, request) => {
    setupConfiguration(request.query.test);
    await indexers.reindexAllArticles();

    context.res = {
        status: 200,
        body: 'Initialization successful'
    };
};
