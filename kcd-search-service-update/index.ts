import { configuration } from '../shared/external/configuration';
import { ALL_CONTENT_TYPES, VALID_OPERATIONS } from '../shared/external/constants';
import { AzureFunction, Context } from '@azure/functions';
import { IWebhookEventGridEvent } from 'kontent-docs-shared-code';
import { SplitService } from '../shared/splitToRecords';
import { getRelevantItems } from '../shared/utils/itemFilter';

const eventType = 'kentico-kontent';

function validateEvent(event: IWebhookEventGridEvent) {
    return event.eventType === eventType && event.data.webhook.items && VALID_OPERATIONS.includes(event.subject);
}

export const eventGridTrigger: AzureFunction = async (
    context: Context,
    eventGridEvent: IWebhookEventGridEvent
): Promise<void> => {
    try {
        if (validateEvent(eventGridEvent)) {
            configuration.set(eventGridEvent.data.test);
            const items = getRelevantItems(eventGridEvent.data.webhook.items, ALL_CONTENT_TYPES);
            await SplitService.splitItemsToRecordsAsync(items);
        } else {
            throw new Error('Validation failed. Unsupported event.');
        }
    } catch (error: any) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};
