const indexers = require('../shared/searchIndexers');
const { setupConfiguration } = require('../shared/external/configuration');

module.exports = async (context, request) => {
    try {
        setupConfiguration(request.query.test);
        await indexers.reindexAllItems();

        context.res = {
            status: 200,
            body: 'Initialization successful',
        };
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};
