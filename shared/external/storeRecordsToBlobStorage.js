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
    const blobURL = BlobStorage.BlobURL.fromContainerURL(containerUrl, item.system.id);
    const blockBlobURL = BlobStorage.BlockBlobURL.fromBlobURL(blobURL);

    const blob = getBlob(itemRecords, item, initialize);

     await blockBlobURL.upload(
         BlobStorage.Aborter.none,
         blob,
         blob.length,
     );
}

function getBlob(itemRecords, item, initialize) {
    return JSON.stringify({
        itemRecords,
        codename: item.system.codename,
        id: item.system.id,
        initialize
    });
}

module.exports = {
    storeRecordsToBlobStorage,
};
