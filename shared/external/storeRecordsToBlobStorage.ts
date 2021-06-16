import { BlobServiceClient } from '@azure/storage-blob';
import { ContentItem } from '@kentico/kontent-delivery';
import { IItemRecord } from '../utils/itemRecordsCreator';
import { Configuration } from './configuration';

export async function storeRecordsToBlobStorageAsync(
    itemRecords: IItemRecord[],
    item: ContentItem,
    initialize = false
) {
    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(Configuration.azureWebJobsStorage);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(Configuration.azureContainerName);

    const blobName = getBlobName(item.system.id);
    const blobData = getBlobData(itemRecords, item, initialize);

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(blobData, blobData.length);
}

function getBlobName(id: string) {
    return `${id}.json`;
}

function getBlobData(itemRecords: IItemRecord[], item: ContentItem, initialize: boolean) {
    return JSON.stringify({
        itemRecords,
        codename: item.system.codename,
        id: item.system.id,
        operation: getOperation(itemRecords, initialize),
        section: 'tutorials'
    });
}

function getOperation(itemRecords: IItemRecord[], initialize: boolean) {
    if (initialize) {
        return 'INITIALIZE';
    } else if (itemRecords.length === 0) {
        return 'DELETE';
    } else {
        return 'UPDATE';
    }
}
