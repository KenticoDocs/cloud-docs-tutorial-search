const SplitService = require('../shared/splitToRecords');
const Configuration = require('../shared/external/configuration');

module.exports = async (context, request) => {
    try {
        Configuration.set(request.query.test);

        await SplitService.splitAllItemsToRecordsAsync();

        context.res = {
            status: 200,
            body: 'Initialization successful',
        };
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};
