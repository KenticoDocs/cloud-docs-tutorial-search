import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { configuration } from '../shared/external/configuration';
import { SplitService } from '../shared/splitToRecords';

export const httpTrigger: AzureFunction = async (context: Context, request: HttpRequest): Promise<void> => {
    try {
        configuration.set(request.query.test ?? '');

        await SplitService.splitAllItemsToRecordsAsync();

        context.res = {
            status: 200,
            body: 'Initialization successful'
        };
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};

