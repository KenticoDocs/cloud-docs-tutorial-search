const BlobStorage = require('@azure/storage-blob');
const Configuration = require('./configuration');

async function storeRecordsToBlobStorage(itemRecords, item, initialize = false) {
    const sharedKeyCredential = new BlobStorage.SharedKeyCredential(
        Configuration.keys.azureStorageAccountName,
        Configuration.keys.azureStorageKey,
    );
    const pipeline = BlobStorage.StorageURL.newPipeline(sharedKeyCredential);
    const serviceUrl = new BlobStorage.ServiceURL(
        `https://${Configuration.keys.azureStorageAccountName}.blob.core.windows.net`,
        pipeline,
    );
    const containerUrl = BlobStorage.ContainerURL.fromServiceURL(serviceUrl, Configuration.keys.azureContainerName);
    const blobName = getBlobName(item.system.id);
    const blobURL = BlobStorage.BlockBlobURL.fromContainerURL(containerUrl, blobName);

    const blob = getBlob(itemRecords, item, initialize);

     await blobURL.upload(
         BlobStorage.Aborter.none,
         blob,
         blob.length,
     );
}

function getBlobName(id) {
    return `${id}.json`;
}

function getBlob(itemRecords, item, initialize) {
    return JSON.stringify({
        itemRecords,
        codename: item.system.codename,
        id: item.system.id,
        operation: getOperation(itemRecords, initialize),
        section: 'tutorials',
    });
}

function getOperation(itemRecords, initialize) {
    if (initialize) {
        return 'INITIALIZE';
    } else if (itemRecords.length === 0) {
        return 'DELETE';
    } else {
        return 'UPDATE';
    }
}

module.exports = {
    storeRecordsToBlobStorage,
};
